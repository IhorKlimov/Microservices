eval $(minikube docker-env)\
&& minikube addons enable ingress\
\
&& docker build -t payments:0.1 -f services/payments/Dockerfile .\
&& kubectl apply -f k8s/payments/deployment.yaml\
&& kubectl apply -f k8s/payments/service.yaml\
&& kubectl apply -f k8s/payments/ingress.yaml\
\
&& docker build -t chat:0.1 -f services/chat/Dockerfile .\
&& kubectl apply -f k8s/chat/deployment.yaml\
&& kubectl apply -f k8s/chat/service.yaml\
&& kubectl apply -f k8s/chat/ingress.yaml\
\
&& docker build -t notifications:0.1 -f services/notifications/Dockerfile .\
&& kubectl apply -f k8s/notifications/deployment.yaml\
&& kubectl apply -f k8s/notifications/service.yaml\
&& kubectl apply -f k8s/notifications/ingress.yaml\
\
&& docker build -t goods:0.1 -f services/goods/Dockerfile .\
&& kubectl apply -f k8s/goods/deployment.yaml\
&& kubectl apply -f k8s/goods/service.yaml\
&& kubectl apply -f k8s/goods/ingress.yaml\
\
&& docker build -t tracking:0.1 -f services/tracking/Dockerfile .\
&& kubectl apply -f k8s/tracking/deployment.yaml\
&& kubectl apply -f k8s/tracking/service.yaml\
&& kubectl apply -f k8s/tracking/ingress.yaml\
\
&& docker build -t client:0.1 -f client/Dockerfile .\
&& kubectl apply -f k8s/client/deployment.yaml\
&& kubectl apply -f k8s/client/service.yaml\
&& kubectl apply -f k8s/client/ingress.yaml