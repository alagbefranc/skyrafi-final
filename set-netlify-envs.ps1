# PowerShell script to set all REACT_APP_ environment variables on Netlify at once
Write-Host "Setting all REACT_APP_ environment variables on Netlify..." -ForegroundColor Green

$envVars = @{
    "REACT_APP_SUPABASE_URL" = "https://wbxmcxqryiggwzzklcdc.supabase.co"
    "REACT_APP_SUPABASE_ANON_KEY" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndieG1jeHFyeWlnZ3d6emtsY2RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4Mjk3NTQsImV4cCI6MjA3MzQwNTc1NH0.kplVnhg45HyiR7IKFGOjbUKLHOvw_0KuGwMZV_gFQVQ"
    "REACT_APP_SUPABASE_ADMIN_CHECK_URL" = "https://wbxmcxqryiggwzzklcdc.supabase.co/functions/v1/admin-check"
    "REACT_APP_SUPABASE_ADMIN_CREATE_JOB_URL" = "https://wbxmcxqryiggwzzklcdc.supabase.co/functions/v1/admin-create-job"
    "REACT_APP_SUPABASE_ADMIN_DELETE_EMPLOYEE_URL" = "https://wbxmcxqryiggwzzklcdc.supabase.co/functions/v1/admin-delete-employee"
    "REACT_APP_SUPABASE_ADMIN_DELETE_JOB_URL" = "https://wbxmcxqryiggwzzklcdc.supabase.co/functions/v1/admin-delete-job"
    "REACT_APP_SUPABASE_ADMIN_LIST_APPLICATIONS_URL" = "https://wbxmcxqryiggwzzklcdc.supabase.co/functions/v1/admin-list-applications"
    "REACT_APP_SUPABASE_ADMIN_LIST_EMPLOYEES_URL" = "https://wbxmcxqryiggwzzklcdc.supabase.co/functions/v1/admin-list-employees"
    "REACT_APP_SUPABASE_ADMIN_LIST_JOBS_URL" = "https://wbxmcxqryiggwzzklcdc.supabase.co/functions/v1/admin-list-jobs"
    "REACT_APP_SUPABASE_ADMIN_LIST_WAITLIST_URL" = "https://wbxmcxqryiggwzzklcdc.supabase.co/functions/v1/admin-list-waitlist"
    "REACT_APP_SUPABASE_ADMIN_UPDATE_APPLICATION_URL" = "https://wbxmcxqryiggwzzklcdc.supabase.co/functions/v1/admin-update-application"
    "REACT_APP_SUPABASE_ADMIN_UPDATE_WAITLIST_URL" = "https://wbxmcxqryiggwzzklcdc.supabase.co/functions/v1/admin-update-waitlist"
    "REACT_APP_SUPABASE_ADMIN_UPSERT_EMPLOYEE_URL" = "https://wbxmcxqryiggwzzklcdc.supabase.co/functions/v1/admin-upsert-employee"
    "REACT_APP_SUPABASE_APPLY_JOB_URL" = "https://wbxmcxqryiggwzzklcdc.supabase.co/functions/v1/apply-job"
    "REACT_APP_SUPABASE_FUNCTION_URL" = "https://wbxmcxqryiggwzzklcdc.supabase.co/functions/v1/join-waitlist"
    "REACT_APP_SUPABASE_LIST_JOBS_URL" = "https://wbxmcxqryiggwzzklcdc.supabase.co/functions/v1/list-jobs"
    "REACT_APP_SUPABASE_UPLOAD_RESUME_URL" = "https://wbxmcxqryiggwzzklcdc.supabase.co/functions/v1/upload-resume"
}

$successCount = 0
$totalCount = $envVars.Count

foreach ($key in $envVars.Keys) {
    try {
        Write-Host "Setting $key..." -ForegroundColor Yellow
        netlify env:set $key $envVars[$key] --force
        if ($LASTEXITCODE -eq 0) {
            $successCount++
            Write-Host "Set $key" -ForegroundColor Green
        } else {
            Write-Host "Failed to set $key" -ForegroundColor Red
        }
    } catch {
        Write-Host "Error setting ${key}: $_" -ForegroundColor Red
    }
}

Write-Host "Environment variables set: $successCount/$totalCount" -ForegroundColor Cyan

if ($successCount -eq $totalCount) {
    Write-Host "All environment variables set successfully! Triggering deployment..." -ForegroundColor Green
    netlify deploy --build --prod
} else {
    Write-Host "Some environment variables failed to set. Please check the errors above." -ForegroundColor Red
}
