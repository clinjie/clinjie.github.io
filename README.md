# 已安装Plugin:

- npm install hexo-generator-feed --save

- npm install hexo-generator-baidu-sitemap --save

- npm install hexo-generator-sitemap

- npm install hexo-math --save

- npm install hexo-generator-searchdb --save
 

# 解压到目录之后，需要重新安装hexo-server

`npm install hexo-server --save`

# 配置 SSH 公钥使用`hexo d`

```
mkdir ~/.ssh    # 如果之前没有这个文件夹就创建此文件夹
cd ~/.ssh       # 进入到 .ssh 文件夹中

ssh-keygen -t rsa -C "youremail@example.com"    # 生成密钥
# 接着会提示输入 file 和 passphrase，直接回车就行。
# 接着会看到下面的输出：
Your identification has been saved in /home/cylong/.ssh/id_rsa.
Your public key has been saved in /home/cylong/.ssh/id_rsa.pub.
The key fingerprint is:
fd:56:db:23:db:bf:df:54:0a:6a:43:51:13:34:22:b6 youremail@example.com

# 接着输入
ssh-add ~/.ssh/id_rsa
```

- 打开 https://github.com/settings/ssh【Github】
- 点击 New SSH key，复制 id_rsa.pub 中的所有内容到 Key 框中
- 输入 ssh -T git@github.com测试是否配置成功。