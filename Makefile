
DIRS = client server worker nginx

dev:
	@for d in $(DIRS); do \
		docker build $$d -f $$d/Dockerfile.$@ -t $$d:$@ ; \
	done

prod:
	@for d in $(DIRS); do \
		docker build $$d -t anorland/complex-$$d ; \
	done

push:
	@for d in $(DIRS); do \
		docker push anorland/complex-$$d ; \
	done

npm-install:
	@for d in $(DIRS); do \
		(cd $$d && npm install); \
	done
