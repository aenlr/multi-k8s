
DIRS = client server worker

dev:
	@for d in $(DIRS); do \
		docker build $$d -f $$d/Dockerfile.$@ -t $$d:$@ ; \
	done

npm-install:
	@for d in $(DIRS); do \
		(cd $$d && npm install); \
	done
