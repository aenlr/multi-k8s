
DIRS = client server worker

all: build

build:
	@for d in $(DIRS); do \
		docker build $$d -t anorland/multi-$$d ; \
	done

push:
	@for d in $(DIRS); do \
		docker push anorland/multi-$$d ; \
	done

npm-install:
	@for d in $(DIRS); do \
		(cd $$d && npm install); \
	done

clean:
	@for d in $(DIRS); do \
		rm -rf $$d/node_modules; \
	done
