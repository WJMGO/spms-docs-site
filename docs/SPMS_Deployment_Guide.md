# SPMS 系统部署指南

**文档版本**：V1.0  
**最后更新**：2026年3月31日  
**适用系统**：SPMS（系统软件部绩效管理系统）  
**文档用途**：指导如何部署 SPMS 系统，使团队成员可以通过网址访问使用

---

## 目录

1. [部署概述](#部署概述)
2. [部署方案对比](#部署方案对比)
3. [推荐方案：Manus 内置部署](#推荐方案manus-内置部署)
4. [方案 2：Docker + 云服务器](#方案-2docker--云服务器)
5. [方案 3：传统服务器部署](#方案-3传统服务器部署)
6. [域名配置](#域名配置)
7. [SSL/HTTPS 配置](#sslhttps-配置)
8. [监控和维护](#监控和维护)
9. [常见问题](#常见问题)
10. [故障排查](#故障排查)

---

## 部署概述

### 什么是部署？

部署是将开发完成的应用程序从本地开发环境转移到生产服务器，使全球用户（或团队成员）可以通过互联网访问的过程。

### SPMS 部署的关键步骤

```
┌─────────────────┐
│  本地开发环境   │  ← 当前阶段
│  (localhost)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  代码版本控制   │  ← Git/GitHub
│  (Git Push)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  构建和打包     │  ← npm run build
│  (Build)        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  部署到服务器   │  ← 选择部署方案
│  (Deploy)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  配置域名       │  ← DNS 配置
│  (Domain)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  上线运营       │  ← 团队成员访问
│  (Production)   │
└─────────────────┘
```

### 部署前的准备清单

- [ ] 代码已提交到 Git 仓库
- [ ] 所有环境变量已配置
- [ ] 数据库已初始化
- [ ] 本地测试通过
- [ ] 依赖包已安装
- [ ] 构建过程无错误
- [ ] 选定部署方案
- [ ] 获得服务器/平台账号

---

## 部署方案对比

### 方案对比表

| 方案 | 优点 | 缺点 | 成本 | 难度 | 推荐度 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Manus 内置** | 零配置、自动 HTTPS、自动扩展 | 依赖 Manus 平台 | 免费 | ⭐ 简单 | ⭐⭐⭐⭐⭐ |
| **Docker + 云服务** | 灵活、可扩展、标准化 | 需要 Docker 知识 | 低-中 | ⭐⭐⭐ 中等 | ⭐⭐⭐⭐ |
| **传统服务器** | 完全控制、成本低 | 需要运维知识 | 低 | ⭐⭐⭐⭐ 复杂 | ⭐⭐ |
| **Vercel/Netlify** | 前端友好、CDN 加速 | 后端支持有限 | 低-中 | ⭐⭐ 简单 | ⭐⭐⭐ |
| **传统虚拟主机** | 便宜、支持多语言 | 性能一般、扩展困难 | 极低 | ⭐⭐⭐ 中等 | ⭐ |

---

## 推荐方案：Manus 内置部署

### 为什么推荐 Manus 内置部署？

✅ **零配置**：无需配置服务器、数据库、SSL  
✅ **自动 HTTPS**：自动配置 SSL 证书  
✅ **自动扩展**：根据流量自动扩展资源  
✅ **内置监控**：实时监控应用状态  
✅ **自动备份**：数据库自动备份  
✅ **快速上线**：点击发布即可上线  
✅ **团队协作**：内置权限管理  

### Manus 部署流程

#### 步骤 1：准备项目

确保项目已通过以下检查：

```bash
# 1. 检查代码是否已提交
git status

# 2. 检查依赖是否完整
npm list

# 3. 本地构建测试
npm run build

# 4. 检查构建产物
ls -la dist/
```

#### 步骤 2：创建检查点（Checkpoint）

在 Manus 管理界面中，点击"保存检查点"按钮：

```bash
# 或通过 CLI 创建检查点
manus-webdev save-checkpoint \
  --message "SPMS v1.0 - 初版部署" \
  --description "包含企业微信认证、绩效评分、员工列表等核心功能"
```

**检查点的作用**：
- 保存当前代码状态
- 生成版本 ID
- 支持回滚到此版本
- 必须有检查点才能发布

#### 步骤 3：发布到生产环境

在 Manus 管理界面中：

1. 进入"Dashboard"面板
2. 找到最新的检查点卡片
3. 点击"Publish"按钮
4. 确认发布信息
5. 等待部署完成（通常 1-5 分钟）

**发布后的结果**：

```
✅ 部署成功
📍 应用 URL: https://spms.manus.space
🔒 自动 HTTPS: 已启用
📊 监控面板: https://manus.space/dashboard
```

#### 步骤 4：获取公开链接

部署完成后，您可以获得以下链接分享给团队：

```
# 应用主页
https://spms.manus.space

# 登录页面
https://spms.manus.space/login

# 仪表板
https://spms.manus.space/dashboard
```

### Manus 部署配置

#### 环境变量配置

在 Manus 管理界面的"Settings"→"Secrets"中配置：

```bash
# 数据库配置（自动配置）
DATABASE_URL=mysql://...

# JWT 配置
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRATION=15m

# 企业微信配置
WEIXIN_WORK_CORPID=ww1234567890abcdef
WEIXIN_WORK_AGENTID=1000001
WEIXIN_WORK_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WEIXIN_WORK_CALLBACK_URL=https://spms.manus.space/api/auth/weixin/callback

# 应用配置
APP_URL=https://spms.manus.space
NODE_ENV=production
```

#### 数据库初始化

```bash
# 在 Manus 管理界面中运行迁移
pnpm db:push

# 或通过 CLI
manus-webdev execute-sql "CREATE TABLE IF NOT EXISTS users (...)"
```

#### 监控和日志

在 Manus 管理界面中查看：

- **实时日志**：应用运行日志
- **性能指标**：CPU、内存、响应时间
- **错误追踪**：应用错误和异常
- **访问统计**：UV/PV 统计

### Manus 部署后的维护

#### 更新应用

当代码有更新时：

```bash
# 1. 本地开发和测试
npm run dev

# 2. 提交代码
git add .
git commit -m "feat: 新增功能"
git push

# 3. 创建新的检查点
manus-webdev save-checkpoint \
  --message "SPMS v1.1 - 新增数据分析功能"

# 4. 发布到生产环境
# 在 Manus 管理界面点击"Publish"
```

#### 回滚到之前版本

如果新版本出现问题，可以快速回滚：

```bash
# 在 Manus 管理界面中
# 1. 进入"Version History"
# 2. 找到之前的检查点
# 3. 点击"Rollback"按钮
# 4. 确认回滚
```

#### 监控应用状态

```bash
# 在 Manus 管理界面中
# 1. 进入"Dashboard"
# 2. 查看"Status Monitor"
# 3. 检查服务器状态、数据库连接、API 响应时间
```

---

## 方案 2：Docker + 云服务器

### 适用场景

- 需要完全控制服务器环境
- 需要自定义配置
- 想要学习 DevOps
- 需要多地域部署

### 云服务提供商选择

| 提供商 | 特点 | 价格 | 推荐度 |
| :--- | :--- | :--- | :--- |
| **阿里云** | 国内访问快、功能全 | 低-中 | ⭐⭐⭐⭐⭐ |
| **腾讯云** | 国内访问快、支持好 | 低-中 | ⭐⭐⭐⭐⭐ |
| **AWS** | 全球覆盖、功能强大 | 中-高 | ⭐⭐⭐⭐ |
| **DigitalOcean** | 简单易用、文档好 | 低-中 | ⭐⭐⭐⭐ |
| **Linode** | 性价比高、稳定 | 低-中 | ⭐⭐⭐⭐ |

### Docker 部署步骤

#### 步骤 1：创建 Dockerfile

在项目根目录创建 `Dockerfile`：

```dockerfile
# 多阶段构建：减小镜像大小

# 阶段 1：构建前端
FROM node:22-alpine AS frontend-builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# 阶段 2：构建后端
FROM node:22-alpine AS backend-builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile --prod

# 阶段 3：运行时镜像
FROM node:22-alpine
WORKDIR /app

# 安装 dumb-init（正确处理信号）
RUN apk add --no-cache dumb-init

# 复制依赖
COPY --from=backend-builder /app/node_modules ./node_modules

# 复制源代码
COPY . .

# 复制前端构建产物
COPY --from=frontend-builder /app/dist ./dist

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# 使用 dumb-init 启动应用
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
```

#### 步骤 2：创建 docker-compose.yml

在项目根目录创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  # 数据库
  mysql:
    image: mysql:8.0
    container_name: spms-mysql
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  # 应用
  app:
    build: .
    container_name: spms-app
    environment:
      NODE_ENV: production
      DATABASE_URL: mysql://${DB_USER}:${DB_PASSWORD}@mysql:3306/${DB_NAME}
      JWT_SECRET: ${JWT_SECRET}
      WEIXIN_WORK_CORPID: ${WEIXIN_WORK_CORPID}
      WEIXIN_WORK_AGENTID: ${WEIXIN_WORK_AGENTID}
      WEIXIN_WORK_SECRET: ${WEIXIN_WORK_SECRET}
      WEIXIN_WORK_CALLBACK_URL: ${WEIXIN_WORK_CALLBACK_URL}
      APP_URL: ${APP_URL}
    ports:
      - "3000:3000"
    depends_on:
      mysql:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    restart: unless-stopped

  # Nginx 反向代理（可选）
  nginx:
    image: nginx:alpine
    container_name: spms-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    restart: unless-stopped

volumes:
  mysql_data:
```

#### 步骤 3：创建 .env 文件

```bash
# 数据库配置
DB_ROOT_PASSWORD=your_root_password
DB_NAME=spms
DB_USER=spms_user
DB_PASSWORD=your_db_password

# JWT 配置
JWT_SECRET=your_jwt_secret_key_here

# 企业微信配置
WEIXIN_WORK_CORPID=ww1234567890abcdef
WEIXIN_WORK_AGENTID=1000001
WEIXIN_WORK_SECRET=your_secret_here
WEIXIN_WORK_CALLBACK_URL=https://spms.yourdomain.com/api/auth/weixin/callback

# 应用配置
APP_URL=https://spms.yourdomain.com
```

#### 步骤 4：部署到云服务器

```bash
# 1. SSH 连接到服务器
ssh root@your_server_ip

# 2. 克隆项目
git clone https://github.com/your-org/spms.git
cd spms

# 3. 创建 .env 文件
cp .env.example .env
# 编辑 .env，填入实际的配置值
nano .env

# 4. 启动 Docker 容器
docker-compose up -d

# 5. 查看日志
docker-compose logs -f app

# 6. 初始化数据库
docker-compose exec app pnpm db:push
```

#### 步骤 5：配置 Nginx 反向代理

创建 `nginx.conf`：

```nginx
upstream app {
    server app:3000;
}

server {
    listen 80;
    server_name spms.yourdomain.com;
    
    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name spms.yourdomain.com;

    # SSL 证书配置
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    # SSL 安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # 日志
    access_log /var/log/nginx/spms_access.log;
    error_log /var/log/nginx/spms_error.log;

    # 反向代理
    location / {
        proxy_pass http://app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # API 路由（可选的特殊处理）
    location /api/ {
        proxy_pass http://app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

#### 步骤 6：获取 SSL 证书

使用 Let's Encrypt 免费 SSL 证书：

```bash
# 安装 Certbot
apt-get update
apt-get install -y certbot python3-certbot-nginx

# 获取证书
certbot certonly --standalone -d spms.yourdomain.com

# 证书位置
# /etc/letsencrypt/live/spms.yourdomain.com/fullchain.pem
# /etc/letsencrypt/live/spms.yourdomain.com/privkey.pem

# 配置自动续期
certbot renew --dry-run
```

### Docker 部署后的维护

#### 查看容器状态

```bash
# 查看所有容器
docker-compose ps

# 查看应用日志
docker-compose logs -f app

# 查看数据库日志
docker-compose logs -f mysql
```

#### 更新应用

```bash
# 1. 拉取最新代码
git pull

# 2. 重新构建镜像
docker-compose build

# 3. 重启容器
docker-compose up -d

# 4. 查看日志确认启动成功
docker-compose logs -f app
```

#### 备份数据库

```bash
# 导出数据库
docker-compose exec mysql mysqldump -u${DB_USER} -p${DB_PASSWORD} ${DB_NAME} > backup.sql

# 导入数据库
docker-compose exec -T mysql mysql -u${DB_USER} -p${DB_PASSWORD} ${DB_NAME} < backup.sql
```

#### 监控应用

```bash
# 查看资源使用情况
docker stats

# 查看容器详细信息
docker inspect spms-app

# 设置容器资源限制
docker update --memory 2g --cpus 1 spms-app
```

---

## 方案 3：传统服务器部署

### 适用场景

- 已有现成的 Linux 服务器
- 需要最大的灵活性
- 不想使用 Docker

### 部署步骤

#### 步骤 1：准备服务器

```bash
# 1. 更新系统
sudo apt-get update
sudo apt-get upgrade -y

# 2. 安装 Node.js（推荐 LTS 版本）
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. 安装 npm 包管理器
npm install -g pnpm

# 4. 安装 Git
sudo apt-get install -y git

# 5. 安装 MySQL
sudo apt-get install -y mysql-server

# 6. 安装 Nginx
sudo apt-get install -y nginx

# 7. 安装 PM2（进程管理）
sudo npm install -g pm2
```

#### 步骤 2：克隆项目

```bash
# 1. 创建应用目录
sudo mkdir -p /var/www/spms
sudo chown -R $USER:$USER /var/www/spms

# 2. 克隆项目
cd /var/www/spms
git clone https://github.com/your-org/spms.git .

# 3. 安装依赖
pnpm install

# 4. 创建 .env 文件
cp .env.example .env
nano .env  # 编辑配置
```

#### 步骤 3：初始化数据库

```bash
# 1. 创建数据库
mysql -u root -p << EOF
CREATE DATABASE spms;
CREATE USER 'spms_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON spms.* TO 'spms_user'@'localhost';
FLUSH PRIVILEGES;
EOF

# 2. 运行迁移
pnpm db:push
```

#### 步骤 4：构建应用

```bash
# 构建前端和后端
pnpm run build

# 检查构建产物
ls -la dist/
```

#### 步骤 5：配置 PM2

创建 `ecosystem.config.js`：

```javascript
module.exports = {
  apps: [
    {
      name: 'spms',
      script: './dist/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ]
};
```

启动应用：

```bash
# 启动应用
pm2 start ecosystem.config.js

# 设置开机自启
pm2 startup
pm2 save

# 查看应用状态
pm2 status

# 查看日志
pm2 logs spms
```

#### 步骤 6：配置 Nginx

编辑 `/etc/nginx/sites-available/spms`：

```nginx
upstream spms_app {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name spms.yourdomain.com;
    
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name spms.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/spms.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/spms.yourdomain.com/privkey.pem;

    access_log /var/log/nginx/spms_access.log;
    error_log /var/log/nginx/spms_error.log;

    location / {
        proxy_pass http://spms_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用配置：

```bash
# 创建符号链接
sudo ln -s /etc/nginx/sites-available/spms /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

#### 步骤 7：获取 SSL 证书

```bash
# 安装 Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# 获取证书
sudo certbot certonly --nginx -d spms.yourdomain.com

# 自动续期
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

---

## 域名配置

### 步骤 1：购买域名

选择域名注册商（如 GoDaddy、阿里云、腾讯云等）购买域名。

### 步骤 2：配置 DNS 记录

在域名注册商的管理后台添加 DNS 记录：

#### A 记录（指向服务器 IP）

```
类型: A
名称: spms
值: 123.45.67.89  (您的服务器 IP)
TTL: 3600
```

#### CNAME 记录（如果使用 CDN）

```
类型: CNAME
名称: spms
值: your-cdn-domain.com
TTL: 3600
```

#### MX 记录（如果需要邮件服务）

```
类型: MX
名称: @
值: mail.yourdomain.com
优先级: 10
TTL: 3600
```

### 步骤 3：验证 DNS 配置

```bash
# 查询 A 记录
nslookup spms.yourdomain.com

# 应该返回您的服务器 IP
# Server: 8.8.8.8
# Address: 8.8.8.8#53
# 
# Non-authoritative answer:
# Name: spms.yourdomain.com
# Address: 123.45.67.89
```

### 步骤 4：等待 DNS 生效

DNS 生效通常需要 24 小时，但通常在几分钟内就能生效。

---

## SSL/HTTPS 配置

### 为什么需要 HTTPS？

✅ **安全性**：加密数据传输  
✅ **信任**：显示绿色锁标记  
✅ **SEO**：搜索引擎优先  
✅ **企业微信要求**：企业微信 OAuth 必须使用 HTTPS  

### 获取 SSL 证书

#### 选项 1：Let's Encrypt（免费）

```bash
# 使用 Certbot 自动获取和续期
sudo certbot certonly --standalone -d spms.yourdomain.com

# 证书位置
# /etc/letsencrypt/live/spms.yourdomain.com/fullchain.pem
# /etc/letsencrypt/live/spms.yourdomain.com/privkey.pem
```

#### 选项 2：付费 SSL 证书

从 SSL 证书提供商（如 Comodo、DigiCert）购买。

#### 选项 3：Manus 自动 HTTPS

使用 Manus 部署时，HTTPS 自动配置，无需手动操作。

### 配置 SSL

#### Nginx 配置

```nginx
server {
    listen 443 ssl http2;
    server_name spms.yourdomain.com;

    # SSL 证书
    ssl_certificate /etc/letsencrypt/live/spms.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/spms.yourdomain.com/privkey.pem;

    # SSL 安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # HSTS（可选，但推荐）
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # 其他配置...
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name spms.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

### 验证 SSL

```bash
# 检查证书有效期
openssl x509 -in /etc/letsencrypt/live/spms.yourdomain.com/fullchain.pem -noout -dates

# 检查证书信息
openssl x509 -in /etc/letsencrypt/live/spms.yourdomain.com/fullchain.pem -noout -text

# 在线检查
# 访问 https://www.ssllabs.com/ssltest/analyze.html?d=spms.yourdomain.com
```

---

## 监控和维护

### 应用监控

#### 使用 PM2 监控

```bash
# 实时监控
pm2 monit

# 查看应用状态
pm2 status

# 查看应用详情
pm2 show spms

# 查看日志
pm2 logs spms --lines 100
```

#### 使用 Manus 监控

在 Manus 管理界面中查看：

- 实时日志
- 性能指标
- 错误追踪
- 访问统计

### 日志管理

#### 日志位置

```bash
# PM2 日志
~/.pm2/logs/

# Nginx 日志
/var/log/nginx/

# 应用日志
./logs/
```

#### 日志轮转

创建 `/etc/logrotate.d/spms`：

```
/var/www/spms/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        pm2 reload spms > /dev/null 2>&1 || true
    endscript
}
```

### 性能优化

#### 启用 Gzip 压缩

```nginx
gzip on;
gzip_types text/plain text/css text/xml text/javascript 
           application/x-javascript application/xml+rss 
           application/javascript application/json;
gzip_min_length 1000;
gzip_comp_level 6;
```

#### 启用缓存

```nginx
# 静态文件缓存
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# HTML 文件不缓存
location ~* \.html$ {
    expires -1;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

#### 启用 CDN

使用 CDN（如 CloudFlare、七牛云）加速静态资源：

```
1. 注册 CDN 服务
2. 上传静态资源到 CDN
3. 更新 HTML 中的资源链接
4. 配置 CDN 缓存策略
```

### 定期备份

#### 数据库备份

```bash
# 每天凌晨 2 点执行备份
0 2 * * * mysqldump -u spms_user -p'password' spms > /backups/spms_$(date +\%Y\%m\%d).sql

# 自动删除 30 天前的备份
0 3 * * * find /backups -name "spms_*.sql" -mtime +30 -delete
```

#### 代码备份

```bash
# 定期推送到 Git
git add .
git commit -m "backup: $(date)"
git push
```

---

## 常见问题

### Q1：如何让团队成员访问系统？

**A**：

1. **获取应用 URL**：
   - Manus：`https://spms.manus.space`
   - 自建：`https://spms.yourdomain.com`

2. **分享链接**：
   ```
   请访问以下链接使用 SPMS 系统：
   https://spms.yourdomain.com
   
   登录方式：使用企业微信账号扫码登录
   ```

3. **创建快捷方式**：
   - 添加到浏览器书签
   - 添加到手机主屏幕
   - 发送到企业微信群

### Q2：如何处理高并发访问？

**A**：

1. **使用负载均衡**：
   ```nginx
   upstream app_backend {
       server 127.0.0.1:3000;
       server 127.0.0.1:3001;
       server 127.0.0.1:3002;
   }
   ```

2. **启用缓存**：
   ```nginx
   proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m;
   location / {
       proxy_cache my_cache;
       proxy_cache_valid 200 1h;
   }
   ```

3. **使用 CDN**：将静态资源分发到 CDN

4. **数据库优化**：
   - 添加索引
   - 使用查询缓存
   - 分库分表

### Q3：如何监控应用是否正常运行？

**A**：

1. **使用 PM2 监控**：
   ```bash
   pm2 monit
   ```

2. **使用 Manus 监控**：在管理界面查看实时日志

3. **设置告警**：
   ```bash
   pm2 install pm2-auto-pull
   ```

4. **定期检查**：
   ```bash
   # 访问健康检查端点
   curl https://spms.yourdomain.com/health
   ```

### Q4：如何处理部署失败？

**A**：

1. **查看日志**：
   ```bash
   pm2 logs spms
   docker-compose logs app
   ```

2. **检查环境变量**：
   ```bash
   env | grep WEIXIN
   ```

3. **检查数据库连接**：
   ```bash
   mysql -u spms_user -p -h localhost spms
   ```

4. **回滚到之前版本**：
   ```bash
   git revert HEAD
   pnpm run build
   pm2 restart spms
   ```

---

## 故障排查

### 应用无法启动

**症状**：访问网站显示 502 Bad Gateway

**排查步骤**：

```bash
# 1. 检查应用是否运行
pm2 status

# 2. 查看应用日志
pm2 logs spms

# 3. 检查端口是否被占用
lsof -i :3000

# 4. 检查环境变量
env | grep DATABASE_URL

# 5. 检查数据库连接
mysql -u spms_user -p -h localhost spms

# 6. 重启应用
pm2 restart spms
```

### 数据库连接失败

**症状**：应用启动时报错 "Cannot connect to database"

**排查步骤**：

```bash
# 1. 检查 MySQL 是否运行
sudo systemctl status mysql

# 2. 检查数据库用户和密码
mysql -u spms_user -p

# 3. 检查数据库是否存在
mysql -u root -p -e "SHOW DATABASES;"

# 4. 检查 .env 中的 DATABASE_URL
cat .env | grep DATABASE_URL

# 5. 重启 MySQL
sudo systemctl restart mysql
```

### SSL 证书过期

**症状**：浏览器显示 "Your connection is not private"

**排查步骤**：

```bash
# 1. 检查证书有效期
openssl x509 -in /etc/letsencrypt/live/spms.yourdomain.com/fullchain.pem -noout -dates

# 2. 手动续期
sudo certbot renew --force-renewal

# 3. 重启 Nginx
sudo systemctl restart nginx

# 4. 验证证书
curl -I https://spms.yourdomain.com
```

### 企业微信登录失败

**症状**：点击"使用企业微信登录"无反应或报错

**排查步骤**：

```bash
# 1. 检查企业微信配置
env | grep WEIXIN

# 2. 检查回调 URL 是否正确
# 应该是 https://spms.yourdomain.com/api/auth/weixin/callback

# 3. 检查企业微信应用权限
# 登录企业微信管理后台，确认应用有"获取成员详情"权限

# 4. 查看应用日志
pm2 logs spms | grep weixin

# 5. 测试 API 调用
curl -X GET "https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=xxx&corpsecret=xxx"
```

### 性能缓慢

**症状**：页面加载缓慢，响应时间长

**排查步骤**：

```bash
# 1. 检查服务器资源
top
free -h
df -h

# 2. 检查数据库查询性能
mysql -u spms_user -p
mysql> EXPLAIN SELECT * FROM performance_assessments;

# 3. 检查 Nginx 日志中的响应时间
tail -f /var/log/nginx/spms_access.log

# 4. 启用 Gzip 压缩
# 编辑 nginx.conf，添加 gzip 配置

# 5. 启用缓存
# 编辑 nginx.conf，添加缓存配置

# 6. 增加服务器资源
# 升级服务器配置或添加更多服务器
```

---

## 部署检查清单

在部署前，请确保以下项目已完成：

### 代码准备

- [ ] 所有代码已提交到 Git
- [ ] 没有未提交的更改
- [ ] 本地测试通过
- [ ] 依赖包已安装
- [ ] 构建过程无错误

### 环境配置

- [ ] 数据库已创建
- [ ] 环境变量已配置
- [ ] 企业微信应用已创建
- [ ] 企业微信回调 URL 已配置
- [ ] SSL 证书已获取

### 部署准备

- [ ] 选定部署方案
- [ ] 服务器已准备
- [ ] 域名已购买
- [ ] DNS 已配置
- [ ] 检查点已创建

### 部署后验证

- [ ] 应用可以访问
- [ ] 登录功能正常
- [ ] 数据库连接正常
- [ ] HTTPS 正常工作
- [ ] 企业微信登录正常
- [ ] 日志无错误

---

## 总结

SPMS 系统部署的关键步骤：

1. ✅ **选择部署方案**：推荐使用 Manus 内置部署
2. ✅ **准备代码**：提交到 Git，创建检查点
3. ✅ **配置环境**：设置环境变量和数据库
4. ✅ **部署应用**：点击发布或使用 Docker/PM2
5. ✅ **配置域名**：购买域名，配置 DNS
6. ✅ **启用 HTTPS**：获取 SSL 证书
7. ✅ **分享链接**：将应用 URL 分享给团队
8. ✅ **监控维护**：定期检查日志和性能

---

**文档结束**

**最后更新**：2026年3月31日  
**版本**：V1.0  
**维护者**：SPMS 开发团队
