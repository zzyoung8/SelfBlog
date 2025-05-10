# 个人博客网站

这是一个使用纯HTML、CSS和JavaScript构建的现代个人博客网站。

## 功能特点

- 响应式设计，适配各种设备
- 现代化UI界面，具有平滑过渡和动画效果
- 个人简介展示
- 项目经历展示
- 技术博客分享（文章、教程和经验分享）
- 生活照片展示
- 联系表单
- 社交媒体链接

## 项目结构

```
├── index.html          # 主页HTML文件
├── tech-blog.html      # 技术博客页面
├── blog-posts/         # 博客文章页面目录
│   └── *.html          # 各博客文章页面
├── css/
│   ├── style.css       # 主要样式文件
│   ├── tech-blog.css   # 技术博客页面样式
│   └── blog-post.css   # 博客文章页面样式
├── js/
│   ├── main.js         # 主要JavaScript脚本
│   └── tech-blog.js    # 技术博客页面脚本
└── images/             # 图片文件夹
    ├── blog/           # 博客相关图片
    └── ...             # 其他图片
```

## 使用方法

1. 克隆或下载此仓库
2. 打开`index.html`文件查看主页
3. 打开`tech-blog.html`文件查看技术博客列表
4. 将您自己的图片添加到`images`文件夹中
5. 根据需要修改HTML内容和CSS样式

## 添加新博客文章

1. 在`blog-posts`文件夹中创建新的HTML文件
2. 使用`blog-posts/redis-cache-issues.html`作为模板
3. 修改文章内容、标题、标签等信息
4. 在`tech-blog.html`页面的文章列表中添加新文章的链接

## 未来计划

- 前端迁移到React框架
- 后端使用Spring框架实现
- 添加用户评论系统
- 实现文章搜索和筛选功能
- 集成Markdown编辑器

## 注意事项

本项目中的示例图片需要您自己提供，请将您的照片和项目图片放置到`images`文件夹中，并相应地更新HTML文件中的路径。 