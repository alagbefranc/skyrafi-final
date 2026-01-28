import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'

const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
}

async function requireAdmin(req: Request, url: string, anon: string) {
    const auth = req.headers.get('Authorization') || ''
    const supabase = createClient(url, anon, { global: { headers: { Authorization: auth } } })
    const { data: user } = await supabase.auth.getUser()
    if (!user || !user.user || !user.user.email) return false

    // Use service role to check admins table to avoid circular RLS if any
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const adminClient = createClient(url, serviceRoleKey)

    const { data } = await adminClient.from('admins').select('email').eq('email', user.user.email).limit(1)
    return !!(data && data.length > 0)
}

Deno.serve(async (req: Request) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
    if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: cors })

    const url = Deno.env.get('SUPABASE_URL')
    const anon = Deno.env.get('SUPABASE_ANON_KEY')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!url || !anon || !serviceRoleKey) {
        return new Response(JSON.stringify({ error: 'Server configuration missing' }), { status: 500, headers: cors })
    }

    // Security check: Verify caller is an admin
    const isAdmin = await requireAdmin(req, url, anon)
    if (!isAdmin) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: cors })

    const { email, role, password, department, status, id } = await req.json().catch(() => ({} as any))

    if (!email || !role) {
        return new Response(JSON.stringify({ error: 'Email and role are required' }), { status: 400, headers: cors })
    }

    const supabaseAdmin = createClient(url, serviceRoleKey)

    let userId = id

    if (password) {
        // Try to create
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { role, department, status }
        })

        if (createError) {
            if (userId) {
                await supabaseAdmin.auth.admin.updateUserById(userId, { password, user_metadata: { role, department, status } })
            }
        } else {
            userId = newUser.user.id
        }
    }

    // 2. Upsert into employees table
    const { error: empError } = await supabaseAdmin.from('employees').upsert({
        email,
        role,
        department,
        status,
    }, { onConflict: 'email' })

    if (empError) return new Response(JSON.stringify({ error: 'Failed to update employee record: ' + empError.message }), { status: 400, headers: cors })

    // 3. Sync with admins table
    if (role === 'admin') {
        const { error: adminErr } = await supabaseAdmin.from('admins').upsert({ email }, { onConflict: 'email' })
        if (adminErr) return new Response(JSON.stringify({ error: 'Failed to add to admins: ' + adminErr.message }), { status: 400, headers: cors })
    } else {
        const { error: delErr } = await supabaseAdmin.from('admins').delete().eq('email', email)
    }

    return new Response(JSON.stringify({ success: true, userId }), { status: 200, headers: cors })
})
