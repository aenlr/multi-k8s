TAG := $(shell git rev-parse HEAD)
REPO = anorland
DIRS = client server worker

all: build

build:
	@for d in $(DIRS); do \
  		cmd="docker build $$d -t $(REPO)/multi-$$d:$(TAG)" && \
  		echo "$$cmd" && $$cmd || exit $$? ; \
	done

push:
	@for d in $(DIRS); do \
  		cmd="docker push $(REPO)/multi-$$d:$(TAG)" && \
  		echo "$$cmd" && $$cmd || exit $$? ; \
	done

deploy:
	kubectl apply -f k8s
	@for d in $(DIRS); do \
  		cmd="kubectl set image deployments/$$d-deployment $$d=$(REPO)/multi-$$d:$(TAG)" && \
  		echo "$$cmd" && $$cmd || exit $$? ; \
	done

secrets:
	kubectl create secret generic postgres --from-literal=PG_PASSWORD=sekrit

npm-install:
	@for d in $(DIRS); do \
		(cd $$d && npm install); \
	done

clean:
	@for d in $(DIRS); do \
		rm -rf $$d/node_modules; \
	done
