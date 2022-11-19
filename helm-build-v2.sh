eval $(minikube docker-env)\
&& minikube addons enable ingress\
&& docker build -t payments:0.1 -f services/payments/Dockerfile .\
&& docker build -t movies:0.1 -f services/movies/Dockerfile .\
&& docker build -t client:0.1 -f client/Dockerfile .\
&& cd helm\
&& helm install local v2\
&& cd ..
