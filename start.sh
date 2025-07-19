docker build -t akademates_front_end .
docker run -d \
  -p 3001:3001 \
  --name akademates_front_end \
  akademates_front_end
