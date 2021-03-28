CONTAINER_NAME = disconnect
HTTP_PORT = 80

build:
	@docker build -t disconnect/bot .

prod:
	@docker run --name=${CONTAINER_NAME} -p ${HTTP_PORT}:80 -d disconnect/bot

dev: 
	@make stop && docker run -d --name=${CONTAINER_NAME} -p ${HTTP_PORT}:8000 disconnect/bot npm start

shell:
	@docker exec -it ${CONTAINER_NAME} bash

stop:
	@docker stop $$(docker ps -a -q --filter ancestor=disconnect/bot --format"{{.ID}}") && \
	docker rm $$(docker ps -a -q --filter ancestor=disconnect/bot --format="{{.ID}}")

ip:
	@docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}{{end}}}' ${CONTAINER_NAME}