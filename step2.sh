eval $(minikube docker-env)\
&& minikube addons enable ingress\
\
&& docker build -t service3:0.1 -f services/service3/Dockerfile .\
&& kubectl apply -f k8s/service3/deployment.yaml\
&& kubectl apply -f k8s/service3/service.yaml\
&& kubectl apply -f k8s/service3/ingress.yaml\
\
&& docker build -t service4:0.1 -f services/service4/Dockerfile .\
&& kubectl apply -f k8s/service4/deployment.yaml\
&& kubectl apply -f k8s/service4/service.yaml\
&& kubectl apply -f k8s/service4/ingress.yaml\
\
&& docker build -t service5:0.1 -f services/service5/Dockerfile .\
&& kubectl apply -f k8s/service5/deployment.yaml\
&& kubectl apply -f k8s/service5/service.yaml\
&& kubectl apply -f k8s/service5/ingress.yaml\
\
&& docker build -t service6:0.1 -f services/service6/Dockerfile .\
&& kubectl apply -f k8s/service6/deployment.yaml\
&& kubectl apply -f k8s/service6/service.yaml\
&& kubectl apply -f k8s/service6/ingress.yaml\
\
&& docker build -t service7:0.1 -f services/service7/Dockerfile .\
&& kubectl apply -f k8s/service7/deployment.yaml\
&& kubectl apply -f k8s/service7/service.yaml\
&& kubectl apply -f k8s/service7/ingress.yaml\
\
&& docker build -t client:0.1 -f client/Dockerfile .\
&& kubectl apply -f k8s/client/deployment.yaml\
&& kubectl apply -f k8s/client/service.yaml\
&& kubectl apply -f k8s/client/ingress.yaml