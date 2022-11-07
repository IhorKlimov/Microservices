### Run in a first terminal window:
minikube delete
minikube start
minikube tunnel

### Run in a second terminal window:
eval $(minikube docker-env)
minikube addons enable ingress

docker build -t service1:0.1 -f services/service1/Dockerfile .
kubectl apply -f k8s/service1/deployment.yaml
kubectl apply -f k8s/service1/service.yaml
kubectl apply -f k8s/service1/ingress.yaml

docker build -t service2:0.1 -f services/service2/Dockerfile .
kubectl apply -f k8s/service2/deployment.yaml
kubectl apply -f k8s/service2/service.yaml
kubectl apply -f k8s/service2/ingress.yaml

docker build -t service3:0.1 -f services/service3/Dockerfile .
kubectl apply -f k8s/service3/deployment.yaml
kubectl apply -f k8s/service3/service.yaml
kubectl apply -f k8s/service3/ingress.yaml

docker build -t client:0.1 -f client/Dockerfile .
kubectl apply -f k8s/client/deployment.yaml
kubectl apply -f k8s/client/service.yaml
kubectl apply -f k8s/client/ingress.yaml


Open the first terminal window and enter your password

Verify correct service functioning by opening in your browser these links:
localhost/api/service1/ping
localhost/api/service2/ping
localhost/api/service3/ping
localhost
