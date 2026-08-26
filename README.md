# Project Overview
## Overview
### About
Student Name: Toka Ahmed Elsayed Ragheb
\
Student ID: DECI4-S-415797

### Links
GitHub Repo: https://github.com/2tcode/DECI4-S-415797-second-term-project

## Demo Pipeline

### Prerequisites
1. Make sure those are installed
```
Git
Docker Desktop
Minikube
kubectl
Helm
AWS CLI
node js
npm
Graphana
Loki
Prometheus
``` 
2. Start Docker Desktop \
verify with `docker ps`

3. start cluster
```
minikube start
minikube status
```

4. port forward Graphana. \
in a seperate powershell: `kubectl port-forward svc/prometheus-grafana 3000:80 -n monitoring`

5. Tunnel minikube
run: `minikube addons enable ingress`\
in a seperate powershell: `minikube tunnel`

6. start ArgoCD dashboard \
in a seperate powershell: `kubectl port-forward svc/argocd-server 8080:443 -n argocd`\
get the password: 
```
 $ARGO_PASS = kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | %{ [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($_)) }
 $ARGO_PASS
```
go to localhost: `https://localhost:8080/`

7. Port forward notifications service: `kubectl port-forward svc/cloudcrafter-notifications 59449:3000 -n aws`

8. Port forward users service: `kubectl port-forward service/cloudcrafter-users -n aws 3001:3000`

9. Set Up the aws notification logs: \

create lamda function:
```
aws --endpoint-url=http://localhost:4566 lambda create-function `
    --function-name notifications-lambda `
    --runtime nodejs18.x `
    --handler index.handler `
    --role arn:aws:iam::000000000000:role/lambda-role `
    --zip-file fileb://lambda/notification.zip
```
config the s3 trigger:
```
aws --endpoint-url=http://localhost:4566 s3api put-bucket-notification-configuration `
    --bucket cloudcrafter-tickets `
    --notification-configuration file://lambda/s3-notification.json
```


### Step 1: Final commit push

initializing git

```
git init
git remote add origin https://github.com/2tcode/DECI4-S-415797-second-term-project
```

adding

```
git add .
git commit -m "message"
```

seperate branches
```
git checkout -b v1.0.x
```

push
```
git push -u origin v1.0.x
```

After merging
```
git checkout main
git pull

git tag -a v1.0.x -m "message"
git push origin v1.0.x
```
### Step 2: CI pipeline
1. Commit the git and push to Github
2. Go to the github repo in https://github.com/2tcode/DECI4-S-415797-second-term-project
3. Open GitHub Actions
4. Verify build finished correctly

### Step 3: ArgoCD
Check the status of the applications using: `kubectl get applications -n argocd` \
Or check it by entering https://localhost:8080/

### Step 4: Final Steps
#### Kubernetes running:
```
kubectl get pods -n aws
kubectl get pods -n google-cloud
kubectl get services -n aws
kubectl get services -n google-cloud
kubectl get ingress -n aws
```
#### Lamda trigger works:
upload a reciept:
```
aws --endpoint-url=http://localhost:4566 s3 cp `
    .\ticket_receipt_4.pdf `
    s3://cloudcrafter-tickets/final-event-test.pdf
```
Take the lambda container name by checking `docker ps` \ 
check the logs using `docker logs <lambda-container-name> --since 2m`

#### verify observability
Check http://localhost:3000

#### Verify JWT secret rotation
Get the old token
```
 $response = Invoke-RestMethod `
     -Uri "http://localhost:3001/login" `
     -Method Post `
    -ContentType "application/json" `
     -Body '{"username":"demo","password":"demo123"}'
     $OLD_TOKEN = $response.token
```
Verify Old token works
```
Invoke-RestMethod `
     -Uri "http://localhost:3001/protected" `
     -Method Get `
    -Headers @{ Authorization = "Bearer $OLD_TOKEN" }
```
rotate the key
```
./scripts/jwt-rotate.ps1
```
restart the deployments
```
kubectl rollout restart deployment/cloudcrafter-users -n aws
```
in another powershell, reconnect the server
```
 kubectl port-forward service/cloudcrafter-users -n aws 3001:3000
```
test the old token
```
Invoke-RestMethod `
    -Uri "http://localhost:3001/protected" `
    -Method Get `
    -Headers @{ Authorization = "Bearer $OLD_TOKEN" }
```
Get the new token
```
$response = Invoke-RestMethod `
     -Uri "http://localhost:3001/login" `
     -Method Post `
    -ContentType "application/json" `
    -Body '{"username":"demo","password":"demo123"}'
$NEW_TOKEN = $response.token
```
test it
```
Invoke-RestMethod `
     -Uri "http://localhost:3001/protected" `
    -Method Get `
     -Headers @{ Authorization = "Bearer $NEW_TOKEN" }
```

#### Verify Multi-Cloud

Verify both environments:

```
kubectl get pods -n aws
kubectl get pods -n google-cloud
```

# Thank you!
##### Hope you like the project