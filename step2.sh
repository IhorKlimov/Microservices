eval $(minikube docker-env)\
&& minikube addons enable ingress\
\
&& docker build -t service1:0.1 -f services/service1/Dockerfile .\
&& kubectl apply -f k8s/service1/deployment.yaml\
&& kubectl apply -f k8s/service1/service.yaml\
&& kubectl apply -f k8s/service1/ingress.yaml\
\
&& docker build -t service2:0.1 -f services/service2/Dockerfile .\
&& kubectl apply -f k8s/service2/deployment.yaml\
&& kubectl apply -f k8s/service2/service.yaml\
&& kubectl apply -f k8s/service2/ingress.yaml\
\
&& docker build -t service3:0.1 -f services/service3/Dockerfile .\
&& kubectl apply -f k8s/service3/deployment.yaml\
&& kubectl apply -f k8s/service3/service.yaml\
&& kubectl apply -f k8s/service3/ingress.yaml\
\
&& docker build -t client:0.1 -f client/Dockerfile .\
&& kubectl apply -f k8s/client/deployment.yaml\
&& kubectl apply -f k8s/client/service.yaml\
&& kubectl apply -f k8s/client/ingress.yaml