import { connect } from 'https://deno.land/x/redis@v0.26.0/mod.ts';


const redis = await connect({
    hostname: "redis-15210.c91.us-east-1-3.ec2.cloud.redislabs.com",
    port: 15210,
    password: "1eyX8AGHDPj961FSiCaaNrcG4a995swi",
  });

  //change to make it dynamic later
  await redis.flushall()
  // const name = await redis.get("name")
  // console.log(name)

  export { redis }