ln -s ../../node_modules .
ln -s ../../../bower_components src/
npm install
bower install
gulp install
export NODE_ENV=dev
sudo node manage.js -o autoflow-ui-node.log start autoflow-ui-node.js