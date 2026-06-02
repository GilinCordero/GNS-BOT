module.exports = {
  apps: [{
    name:       'isp-chatbot',
    script:     'src/server.js',
    instances:  1,           // fork — OBLIGATORIO con node-cache in-process
    exec_mode:  'fork',
    watch:      false,
    env_production: { NODE_ENV: 'production' },
    out_file:   '/var/log/isp-chatbot/out.log',
    error_file: '/var/log/isp-chatbot/error.log',
    max_memory_restart: '500M',
  }]
}
