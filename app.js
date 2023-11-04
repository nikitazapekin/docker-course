const express = require('express')
const path = require('path')
const fs = require('fs').promises

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'pages'))

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

const port = process.env.PORT ?? 3000
const logsPath = path.resolve(__dirname, 'data', 'logs.txt')

app.get('/', async (req, res) => {
  const data = await fs.readFile(logsPath, 'utf-8')
  const logs = data.split('\r\n').filter(i => !!i)
  res.render('index', {logs})
})

app.post('/', async (req, res) => {
  const text = req.body.text
  await fs.appendFile(logsPath, `${text}\r\n`)
  res.redirect('/')
})

console.log("lrkjjjj")

app.listen(port, () => console.log(`Server listening on port ${port}`))



//node app.js


/*
Dockerfile
FROM node  
WORKDIR /app
COPY . .
RUN yarn install
EXPOSE 3000
CMD ["node", "app.js"]
docker build .


Теперь мы видим контейнер
docker images
REPOSITORY   TAG       IMAGE ID       CREATED              SIZE
<none>       <none>    3b605abf52a0   About a minute ago   1.12GB
<none>       <none>    fd5a9af41bab   12 hours ago         1.02GB
node         latest    b612cbc8128d   2 days ago           1.1GB
PS C:\Users\wotbl\logs-app> 


Остановим контейнер 
PS C:\Users\wotbl\logs-app> docker ps
CONTAINER ID   IMAGE          COMMAND                  CREATED              STATUS              PORTS      NAMES
39333782a67f   3b605abf52a0   "docker-entrypoint.s…"   About a minute ago   Up About a minute   3000/tcp   quirky_ishizaka
PS C:\Users\wotbl\logs-app> docker stop 3b605abf52a0
Error response from daemon: No such container: 3b605abf52a0
PS C:\Users\wotbl\logs-app> docker stop 39333782a67f 
39333782a67f
PS C:\Users\wotbl\logs-app> 




запустить контейнер 
PS C:\Users\wotbl\logs-app> docker ps -a
CONTAINER ID   IMAGE          COMMAND                  CREATED        STATUS                       PORTS     NAMES
39333782a67f   3b605abf52a0   "docker-entrypoint.s…"   9 hours ago    Exited (137) 9 minutes ago             quirky_ishizaka
05b6bc997781   node           "docker-entrypoint.s…"   9 hours ago    Exited (0) 45 minutes ago              heuristic_pasteur
f81579afb0b0   node           "docker-entrypoint.s…"   9 hours ago    Exited (0) 49 minutes ago              sharp_haslett
b2dd0a567985   node           "docker-entrypoint.s…"   20 hours ago   Exited (0) 12 hours ago                xenodochial_babbage
PS C:\Users\wotbl\logs-app> docker start  3b605abf52a0
Error response from daemon: No such container: 3b605abf52a0
Error: failed to start containers: 3b605abf52a0
PS C:\Users\wotbl\logs-app> docker start 39333782a67f
39333782a67f
PS C:\Users\wotbl\logs-app> 




Можно запустиь вот так контейнер



PS C:\Users\wotbl\logs-app> docker images      
REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
<none>       <none>    3b605abf52a0   9 hours ago    1.12GB
<none>       <none>    fd5a9af41bab   21 hours ago   1.02GB
node         latest    b612cbc8128d   2 days ago     1.1GB
PS C:\Users\wotbl\logs-app> docker run -p 3000:3000 3b605abf52a0
Server listening on port 3000


Остановим это безумие 
PS C:\Users\wotbl\logs-app> docker ps
CONTAINER ID   IMAGE          COMMAND                  CREATED              STATUS              PORTS                    NAMES
7c8ae054180c   3b605abf52a0   "docker-entrypoint.s…"   About a minute ago   Up About a minute   0.0.0.0:3000->3000/tcp   zen_cerf
5918a3ccd1af   3b605abf52a0   "docker-entrypoint.s…"   5 minutes ago        Up 5 minutes        3000/tcp                 naughty_williams
PS C:\Users\wotbl\logs-app> docker stop 7c8ae054180c 5918a3ccd1af
7c8ae054180c
5918a3ccd1af
PS C:\Users\wotbl\logs-app> docker ps
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
PS C:\Users\wotbl\logs-app> 




можно запустить и по имени
PS C:\Users\wotbl\logs-app> docker ps -a
CONTAINER ID   IMAGE          COMMAND                  CREATED          STATUS                        PORTS     NAMES
7c8ae054180c   3b605abf52a0   "docker-entrypoint.s…"   6 minutes ago    Exited (137) 4 minutes ago              zen_cerf
5918a3ccd1af   3b605abf52a0   "docker-entrypoint.s…"   11 minutes ago   Exited (137) 4 minutes ago              naughty_williams
39333782a67f   3b605abf52a0   "docker-entrypoint.s…"   9 hours ago      Exited (137) 12 minutes ago             quirky_ishizaka
05b6bc997781   node           "docker-entrypoint.s…"   10 hours ago     Exited (0) 10 hours ago                 heuristic_pasteur
f81579afb0b0   node           "docker-entrypoint.s…"   10 hours ago     Exited (0) 10 hours ago                 sharp_haslett
b2dd0a567985   node           "docker-entrypoint.s…"   21 hours ago     Exited (0) 21 hours ago                 xenodochial_babbage
PS C:\Users\wotbl\logs-app> docker ps
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
PS C:\Users\wotbl\logs-app> docker start  zen_cerf
zen_cerf



удалить все конты
PS C:\Users\wotbl\logs-app> docker container prune
WARNING! This will remove all stopped containers.
Are you sure you want to continue? [y/N]
Total reclaimed space: 0B



можно и вот так вот
Error response from daemon: pull access denied for 89d072e290af, repository does not exist or may require 'docker login': denied: requested access to the resource is denied
PS C:\Users\wotbl\logs-app> docker image ls
REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
<none>       <none>    3b605abf52a0   10 hours ago   1.12GB
<none>       <none>    fd5a9af41bab   22 hours ago   1.02GB
node         latest    b612cbc8128d   2 days ago     1.1GB
PS C:\Users\wotbl\logs-app> docker run -d -p 3000:3000 3b605abf52a0
d4fa78e1f81a429abf7e95c0ef55f61ca7303ab5c912c4a94e3770a4d7f21275
*/