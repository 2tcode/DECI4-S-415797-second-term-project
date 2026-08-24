$ErrorActionPreference = "Stop"

$usersPath = ".\services\users"

$privateKey = "$usersPath\private-new.key"
$publicKey  = "$usersPath\public-new.key"

Write-Host "=== Generating new JWT key pair ==="

openssl genrsa -out $privateKey 2048
openssl rsa -in $privateKey -pubout -out $publicKey

Write-Host "=== Updating AWS secret ==="

kubectl create secret generic users-jwt-keys `
    -n aws `
    --from-file=private.key=$privateKey `
    --from-file=public.key=$publicKey `
    --dry-run=client -o yaml |
    kubectl apply -f -

Write-Host "=== Updating Google Cloud secret ==="

kubectl create secret generic users-jwt-keys `
    -n google-cloud `
    --from-file=private.key=$privateKey `
    --from-file=public.key=$publicKey `
    --dry-run=client -o yaml |
    kubectl apply -f -

Write-Host ""
Write-Host "=== JWT keys rotated in both environments ==="