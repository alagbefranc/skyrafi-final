# PowerShell script to set all REACT_APP_ environment variables on Netlify

# Set all REACT_APP_ environment variables for production
netlify env:set REACT_APP_SUPABASE_URL "https://wbxmcxqryiggwzzklcdc.supabase.co"
netlify env:set REACT_APP_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndieG1jeHFyeWlnZ3d6emtsY2RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4Mjk3NTQsImV4cCI6MjA3MzQwNTc1NH0.kplVnhg45HyiR7IKFGOjbUKLHOvw_0KuGwMZV_gFQVQ"
netlify env:set REACT_APP_SUPABASE_FUNCTION_URL "https://wbxmcxqryiggwzzklcdc.supabase.co/functions/v1/join-waitlist"
netlify env:set REACT_APP_SUPABASE_LIST_JOBS_URL "https://wbxmcxqryiggwzzklcdc.supabase.co/functions/v1/list-jobs"
netlify env:set REACT_APP_SUPABASE_APPLY_JOB_URL "https://wbxmcxqryiggwzzklcdc.supabase.co/functions/v1/apply-job"
netlify env:set REACT_APP_SUPABASE_UPLOAD_RESUME_URL "https://wbxmcxqryiggwzzklcdc.supabase.co/functions/v1/upload-resume"

# Admin URLs
netlify env:set REACT_APP_SUPABASE_ADMIN_CHECK_URL "https://wbxmcxqryiggwzzklcdc.supabase.co/functions/v1/admin-check"
netlify env:set REACT_APP_SUPABASE_ADMIN_LIST_JOBS_URL "https://wbxmcxqryiggwzzklcdc.supabase.co/functions/v1/admin-list-jobs"
netlify env:set REACT_APP_SUPABASE_ADMIN_LIST_APPLICATIONS_URL "https://wbxmcxqryiggwzzklcdc.supabase.co/functions/v1/admin-list-applications"
netlify env:set REACT_APP_SUPABASE_ADMIN_CREATE_JOB_URL "https://wbxmcxqryiggwzzklcdc.supabase.co/functions/v1/admin-create-job"
netlify env:set REACT_APP_SUPABASE_ADMIN_LIST_WAITLIST_URL "https://wbxmcxqryiggwzzklcdc.supabase.co/functions/v1/admin-list-waitlist"
netlify env:set REACT_APP_SUPABASE_ADMIN_LIST_EMPLOYEES_URL "https://wbxmcxqryiggwzzklcdc.supabase.co/functions/v1/admin-list-employees"
netlify env:set REACT_APP_SUPABASE_ADMIN_UPSERT_EMPLOYEE_URL "https://wbxmcxqryiggwzzklcdc.supabase.co/functions/v1/admin-upsert-employee"
netlify env:set REACT_APP_SUPABASE_ADMIN_UPDATE_WAITLIST_URL "https://wbxmcxqryiggwzzklcdc.supabase.co/functions/v1/admin-update-waitlist"
netlify env:set REACT_APP_SUPABASE_ADMIN_DELETE_JOB_URL "https://wbxmcxqryiggwzzklcdc.supabase.co/functions/v1/admin-delete-job"
netlify env:set REACT_APP_SUPABASE_ADMIN_UPDATE_APPLICATION_URL "https://wbxmcxqryiggwzzklcdc.supabase.co/functions/v1/admin-update-application"
netlify env:set REACT_APP_SUPABASE_ADMIN_DELETE_EMPLOYEE_URL "https://wbxmcxqryiggwzzklcdc.supabase.co/functions/v1/admin-delete-employee"

Write-Host "All REACT_APP_ environment variables have been set on Netlify!"
Write-Host "Run 'netlify deploy --prod' to trigger a new build with these variables."
