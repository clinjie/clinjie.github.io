title: Android Application版本更新
date: 2016-07-30 22:24:06
tags:
- android
categories: android
---

# get&set版本号 #

## set ##

在传统的Eclipse IDE开发中，我们通常只需要在清单文件`manifests`中写入相应代码即可搞定。

```
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="your package name"
    android:versionCode="1"
    android:versionName="1.1.1">
```

- package属性的值为工程默认包名，一般不用我们重新设置。

- android:versionCode属性值为int型，开发者可见，开发版本号

- android:versionName属性为String类型，用户可见，我们需要使用的就是这个值。

<!--more-->
后两个属性在默认情况下是没有的，我们需要添加版本信息时候，可以自行添加。



在Android Studio中没我们使用Gradle开发工具，版本信息设置与传统Eclipse不同，需要更新Gradle.Scripts中的build.gradle(Module:app)中修改相关代码。


```
defaultConfig {
        applicationId "your package name"
        minSdkVersion 14
        targetSdkVersion 23
        versionCode 2
        versionName "1.1.2"
```
默认5个属性，minSdkVersion为向下兼容最低平台版本；targetSdkVersion为目标平台版本


## get ##

```java
public String getVersionCode(Context context)
    {
        try {
            PackageManager manager = context.getPackageManager();
            PackageInfo info = manager.getPackageInfo(this.getPackageName(), 0);
            String version = info.versionName;
            return version;
        } catch (Exception e) {
            e.printStackTrace();
            return "Can't get application version_name";
        }
    }
```

# 版本对比与更新 #

## 对比 ##

```xml
<update>
    <version>1.1.2</version>
    <name>2048</name>
    <url>https://raw.githubusercontent.com/xxxx/xxxxx/xxxxx/xxxx.apk</url>
</update>
```

在服务器中房屋文件update.xml，内容如上。

- version 属性值为上文记录的`versionName`

- url 属性值为新版本apk文件直接下载地址


## xml文件内容转换 ##

```java
public class ParseXmlService {
    public HashMap<String, String> parseXml(InputStream inStream) throws Exception
    {
        HashMap<String, String> hashMap = new HashMap<String, String>();

        // 实例化一个文档构建器工厂
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        // 通过文档构建器工厂获取一个文档构建器
        DocumentBuilder builder = factory.newDocumentBuilder();
        // 通过文档通过文档构建器构建一个文档实例
        Document document = builder.parse(inStream);
        //获取XML文件根节点
        Element root = document.getDocumentElement();
        //获得所有子节点
        NodeList childNodes = root.getChildNodes();
        for (int j = 0; j < childNodes.getLength(); j++)
        {
            //遍历子节点
            Node childNode = (Node) childNodes.item(j);
            if (childNode.getNodeType() == Node.ELEMENT_NODE)
            {
                Element childElement = (Element) childNode;
                //版本号
                if ("version".equals(childElement.getNodeName()))
                {
                    hashMap.put("version",childElement.getFirstChild().getNodeValue());
                }
                //下载地址
                else if (("url".equals(childElement.getNodeName())))
                {
                    hashMap.put("url",childElement.getFirstChild().getNodeValue());
                }
            }
        }
        return hashMap;
    }
}
``` 

返回包含版本信息以及下载地址信息的Map

```java
String serviceCode = mHashMap.get("version");
            // 版本判断
            if (!serviceCode.equals(versionCode))
            {
                return true;
            }
```

## 下载 ##

下载等网络相关代码不能在主线程中展开，新开一个线程

```java
String sdpath = Environment.getExternalStorageDirectory() + "/";
mSavePath = sdpath + "download";
URL url = null;
try {
    url = new URL(mHashMap.get("url"));
} catch (MalformedURLException e) {
    e.printStackTrace();
}
// 创建连接
HttpURLConnection conn = null;
try {
    conn = (HttpURLConnection) url.openConnection();
} catch (IOException e) {
    e.printStackTrace();
}
conn.connect();
// 获取文件大小
int length = conn.getContentLength();
// 创建输入流
InputStream is = conn.getInputStream();

File file = new File(mSavePath);
// 判断文件目录是否存在
if (!file.exists())
{
    file.mkdir();
}
File apkFile = new File(mSavePath, mHashMap.get("name"));
FileOutputStream fos = new FileOutputStream(apkFile);
int count = 0;
// 缓存
byte buf[] = new byte[1024];
// 写入到文件中
do
{
    int numread = is.read(buf);
    count += numread;
    // 计算进度条位置
    progress = (int) (((float) count / length) * 100);
    // 更新进度
    mHandler.sendEmptyMessage(DOWNLOAD);
    if (numread <= 0)
    {
        // 下载完成
        mHandler.sendEmptyMessage(DOWNLOAD_FINISH);
        break;
    }
    // 写入文件
    fos.write(buf, 0, numread);
} while (!cancelUpdate);// 点击取消就停止下载.
fos.close();
is.close();
```