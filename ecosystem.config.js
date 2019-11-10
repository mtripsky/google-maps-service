module.exports = {
  apps: [{
    name: 'google-maps-service',
    script: './server.js'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-3-15-179-48.us-east-2.compute.amazonaws.com',
      key: '~/.ssh/todo-matej.pem',
      ref: 'origin/master',
      repo: 'https://github.com/mtripsky/google-maps-service.git',
      path: '/home/ubuntu/google-maps-service',
      'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
    }
  }
}
