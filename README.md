# Step 1 instructions
## 1. Docker Desktop
### Open Docker Desktop and wait until it is running

## 2. Project
cd C:\Users\Toka\Desktop\Starter-file-DECI4-S-415797

## 3. Kubernetes
minikube start
kubectl get pods
kubectl get svc

## 4. Notifications tunnel
minikube service notifications --url
### KEEP THIS TERMINAL OPEN

## 5. New PowerShell window
cd C:\Users\Toka\Desktop\Starter-file-DECI4-S-415797

## 6. Test notifications
Invoke-RestMethod http://127.0.0.1:XXXXX/health

## 7. Start LocalStack if needed
docker ps
### If stopped:
docker compose up -d

## 8. AWS credentials
$env:AWS_ACCESS_KEY_ID="test"
$env:AWS_SECRET_ACCESS_KEY="test"
$env:AWS_DEFAULT_REGION="us-east-1"

## 9. Check LocalStack
aws --endpoint-url=http://localhost:4566 s3 ls

## 10. Check Lambda
aws --endpoint-url=http://localhost:4566 lambda list-functions

## 11. Check S3 trigger
aws --endpoint-url=http://localhost:4566 s3api get-bucket-notification-configuration `
  --bucket cloudcrafter-tickets

## 12. Test
aws --endpoint-url=http://localhost:4566 s3 cp `
  .\starter-file\ticket_receipt_4.pdf `
  s3://cloudcrafter-tickets/reboot-test.pdf

## 13. Check notification
Invoke-RestMethod http://127.0.0.1:XXXXX/notifications