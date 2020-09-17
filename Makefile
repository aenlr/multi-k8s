TAG = latest
REPO = anorland
DIRS = client server worker

all: build

build:
	@for d in $(DIRS); do \
		docker build $$d -t $(REPO)/multi-$$d:$(TAG) ; \
	done

push:
	@for d in $(DIRS); do \
		docker push $(REPO)/multi-$$d:$(TAG) ; \
	done

npm-install:
	@for d in $(DIRS); do \
		(cd $$d && npm install); \
	done

deploy:
	kubectl apply -f k8s
	@for d in $(DIRS); do \
  		kubectl set image deployments/$$d-deployment $$d=$(REPO)/multi-$$d:$(TAG) ;
	done

clean:
	@for d in $(DIRS); do \
		rm -rf $$d/node_modules; \
	done
