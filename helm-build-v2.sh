eval $(minikube docker-env)\
&& minikube addons enable ingress\
&& docker build -t payments:0.1 -f services/payments/Dockerfile .\
&& docker build -t chat:0.1 -f services/chat/Dockerfile .\
&& docker build -t notifications:0.1 -f services/notifications/Dockerfile .\
&& docker build -t goods:0.1 -f services/goods/Dockerfile .\
&& docker build -t tracking:0.1 -f services/tracking/Dockerfile .\
&& docker build -t client:0.1 -f client/Dockerfile .\
&& cd helm\
&& helm install local v2\
&& cd ..
