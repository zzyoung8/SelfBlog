# YOUNG 个人博客项目

这是一个使用 Spring Boot 和 React 实现的个人博客网站。

## 项目结构

- `blog-backend`: Spring Boot 后端项目
- `blog-frontend`: React 前端项目

## 技术栈

### 后端
- Spring Boot 3.1.5
- Spring Data JPA
- H2 数据库 (开发环境)
- Maven

### 前端
- React 18
- React Router 6
- Axios
- CSS3

## 如何运行

### 后端

1. 进入后端项目目录
```bash
cd blog-backend
```

2. 使用 Maven 构建项目
```bash
mvn clean install
```

3. 运行 Spring Boot 应用
```bash
mvn spring-boot:run
```

后端服务器将在 http://localhost:8080 上启动。

### 前端

1. 进入前端项目目录
```bash
cd blog-frontend
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm start
```

前端应用将在 http://localhost:3000 上启动。

## 功能特性

- 响应式设计，适配各种设备
- 个人信息展示
- 博客文章列表和详情页
- 按类别筛选文章
- 文章搜索功能
- 联系表单

## 开发进度

- [x] 项目初始化
- [x] 后端 API 设计
- [x] 数据库模型设计
- [x] 个人主页实现
- [ ] 博客文章列表页
- [ ] 博客文章详情页
- [ ] 管理后台 