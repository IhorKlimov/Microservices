eval $(minikube docker-env)\
&& minikube addons enable ingress\
\
&& docker build -t payments:0.1 -f services/payments/Dockerfile .\
&& kubectl apply -f k8s/payments/deployment.yaml\
&& kubectl apply -f k8s/payments/service.yaml\
&& kubectl apply -f k8s/payments/ingress.yaml\
\
&& docker build -t movies:0.1 -f services/movies/Dockerfile .\
&& kubectl apply -f k8s/movies/deployment.yaml\
&& kubectl apply -f k8s/movies/service.yaml\
&& kubectl apply -f k8s/movies/ingress.yaml\
\
&& docker build -t client:0.1 -f client/Dockerfile .\
&& kubectl apply -f k8s/client/deployment.yaml\
&& kubectl apply -f k8s/client/service.yaml\
&& kubectl apply -f k8s/client/ingress.yaml