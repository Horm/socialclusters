FROM ubuntu:18.10
RUN apt-get update
RUN apt-get install -y python3 python3-dev python3-pip nginx
RUN apt-get update && apt-get install -y \
curl
RUN pip3 install uwsgi
COPY ./ ./app
WORKDIR ./app
RUN pip3 install -r requirements.txt
WORKDIR ./src
ENV ENV=prod
ENTRYPOINT [ "python3" ]
CMD [ "./server.py" ]
