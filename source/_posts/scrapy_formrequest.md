title: Scrapy解决formrequest中formdata为dict问题
date: 2016-11-2 22:28:30
tags:
- python
- Scrapy
categories: python
---

在Scrapy的FormRequest中直接将formdata设置为dict形式后，scrapy经过字节编码形式的转换，会发出一个非期望的request，例如：

<!--more-->

```python
FormRequest(url="**************************",
			meta = {'cookiejar' : response.meta['cookiejar']},
			formdata = {
			'params': {"offset":10,"start":"10"},
			'method': 'next',
			})
```


我们此时将发送的表单数据，属性params的值设置为dict，原有的请求形式为：

`params=%7B%22offset%22%3A10%2C%22start%22%3A%2210%22%7D&method=next`

经过错误的变换之后，发送的请求变为：

`params=start&params=offset&method=next`


上面的url中`%`开始的字符是经过bytes变换之后的形式，翻译成我们能看懂的就是：


`params={"offset":10,"start":"10"}&method=next`


在Scrapy的源码文件`/http/request/form.py`中，定义了scrapy是如何将formdata处理：

```python
items = formdata.items() if isinstance(formdata, dict) else formdata
def _urlencode(seq, enc):
    values = [(to_bytes(k, enc), to_bytes(v, enc))
              for k, vs in seq
              for v in (vs if is_listlike(vs) else [vs])]
    return urlencode(values, doseq=1)
```

其中seq就是原始的formdata.items()，enc的编码格式，这里我们忽略。经过items()方法执行后，原始的外围的dict格式变成列表形式：

`dict_items([('method', 'next'), ('params', {'start': '10', 'offset': 10})])`

再经过_urlencode方法将items转换成


`[(b'method', b'next'), (b'params', b'start'), (b'params', b'offset')]`

可以看到就是在调用_urlencode方法的时候出现了问题，上面的方法执行过后，会使字典形式的数据只保留了keys，将字典数据作为的value的key分别当做字典数据value。

幸运的是，网络中dict形式的请求是直接将`{'':'','',''}`这种转换成bytes形式传递，没有再进行其他转换，至于dic的解析则由服务器端处理，所以我们直接将dic的数据外面加上''，转换成字符串形式。

```python
formdata = {
			'params': '{"offset":10,"start":"10"}',
			'method': 'next',
			}
```

此时变成了:

`dict_items([('method', 'next'), ('params', {'start': '10', 'offset': 10})])`