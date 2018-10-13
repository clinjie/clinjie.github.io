title: TensorFlow简单使用Cifar数据集
date: 2017-03-26 22:18:42
tags: Tensorflow
categories: Tensorflow
---


这篇文章是对TensorFlow官方例子：CIFAR-10数据集分类的理解记录。

对CIFAR-10 数据集的分类是机器学习中一个公开的基准测试问题，其任务是对一组大小为32x32的RGB图像进行分类，这些图像涵盖了10个类别：

飞机， 汽车， 鸟， 猫， 鹿， 狗， 青蛙， 马， 船以及卡车。

[数据集主页](http://www.cs.toronto.edu/~kriz/cifar.html)

[Python项目代码页面](https://github.com/tensorflow/models/tree/master/tutorials/image/cifar10)

这里主要介绍`cifar10_input.py`、`caifar10.py`、`caifar_train.py`和`cifar10_eval.py`
<!--more-->
# 模型输入

`cifar10_input.py`文件，从二进制文件`cifar-10-binary.tar.gz`中提取数据

```python
def distorted_inputs(data_dir, batch_size):

  filenames = [os.path.join(data_dir, 'data_batch_%d.bin' % i)
               for i in xrange(1, 6)]
  for f in filenames:
    if not tf.gfile.Exists(f):
      raise ValueError('Failed to find file: ' + f)

  filename_queue = tf.train.string_input_producer(filenames)

  read_input = read_cifar10(filename_queue)
  reshaped_image = tf.cast(read_input.uint8image, tf.float32)

  height = IMAGE_SIZE
  width = IMAGE_SIZE


  distorted_image = tf.random_crop(reshaped_image, [height, width, 3])
  distorted_image = tf.image.random_flip_left_right(distorted_image)
  distorted_image = tf.image.random_brightness(distorted_image,
                                               max_delta=63)
  distorted_image = tf.image.random_contrast(distorted_image,
                                             lower=0.2, upper=1.8)
  float_image = tf.image.per_image_standardization(distorted_image)


  float_image.set_shape([height, width, 3])
  read_input.label.set_shape([1])


  min_fraction_of_examples_in_queue = 0.4
  min_queue_examples = int(NUM_EXAMPLES_PER_EPOCH_FOR_TRAIN *
                           min_fraction_of_examples_in_queue)

  return _generate_image_and_label_batch(float_image,read_input.label,min_queue_examples, batch_size,shuffle=True)
```

主要函数有两个，`inputs`和`distorted_inputs`，这里贴出来的是`distorted_inputs`。两个方法都是从训练/测试 数据集文件中读取数据，后者针对测试集，裁剪图像、提取变换成相应的格式，前者针对训练集，在变化成需要格式前，还要进行图像的处理，如翻转，亮度变换、随机替换等等来增加数据集。返回的是构建生成的数据样本和标签。

# 模型构建

使用CNN模型，包括两级卷基层、两级全连接层和最后的softmax激励函数输出。

## 模型

```python
def inference(images):
  # 卷基层1
  with tf.variable_scope('conv1') as scope:
    # 过滤器
    kernel = _variable_with_weight_decay('weights',
                                         shape=[5, 5, 3, 64],
                                         stddev=5e-2,
                                         wd=0.0)
    conv = tf.nn.conv2d(images, kernel, [1, 1, 1, 1], padding='SAME')
    # 偏置
    biases = _variable_on_cpu('biases', [64], tf.constant_initializer(0.0))
    pre_activation = tf.nn.bias_add(conv, biases)
    # Relu非线性处理
    conv1 = tf.nn.relu(pre_activation, name=scope.name)
    _activation_summary(conv1)

  # 池化降维
  pool1 = tf.nn.max_pool(conv1, ksize=[1, 3, 3, 1], strides=[1, 2, 2, 1],
                         padding='SAME', name='pool1')
  # 归一化处理
  norm1 = tf.nn.lrn(pool1, 4, bias=1.0, alpha=0.001 / 9.0, beta=0.75,name='norm1')

  # 卷积层2
  with tf.variable_scope('conv2') as scope:
    kernel = _variable_with_weight_decay('weights',
                                         shape=[5, 5, 64, 64],
                                         stddev=5e-2,
                                         wd=0.0)
    conv = tf.nn.conv2d(norm1, kernel, [1, 1, 1, 1], padding='SAME')
    biases = _variable_on_cpu('biases', [64], tf.constant_initializer(0.1))
    pre_activation = tf.nn.bias_add(conv, biases)
    conv2 = tf.nn.relu(pre_activation, name=scope.name)
    _activation_summary(conv2)

  # 归一化
  norm2 = tf.nn.lrn(conv2, 4, bias=1.0, alpha=0.001 / 9.0, beta=0.75, name='norm2')
  # 池化
  pool2 = tf.nn.max_pool(norm2, ksize=[1, 3, 3, 1],strides=[1, 2, 2, 1], padding='SAME', name='pool2')

  # 全连接层
  with tf.variable_scope('local3') as scope:
    # 尺寸对应全连接层变换处理
    reshape = tf.reshape(pool2, [FLAGS.batch_size, -1])
    dim = reshape.get_shape()[1].value
    weights = _variable_with_weight_decay('weights', shape=[dim, 384],
                                          stddev=0.04, wd=0.004)
    biases = _variable_on_cpu('biases', [384], tf.constant_initializer(0.1))
    # 不再使用卷积乘tf.nn.conv2d，直接矩阵乘
    local3 = tf.nn.relu(tf.matmul(reshape, weights) + biases, name=scope.name)
    _activation_summary(local3)

  # 全连接层2
  with tf.variable_scope('local4') as scope:
    weights = _variable_with_weight_decay('weights', shape=[384, 192],stddev=0.04, wd=0.004)
    biases = _variable_on_cpu('biases', [192], tf.constant_initializer(0.1))
    local4 = tf.nn.relu(tf.matmul(local3, weights) + biases, name=scope.name)
    _activation_summary(local4)

  # (WX + b),线性logit，这里没使用softmax直接输出未归一化的logits是因为需要在loss中直接计算熵，使用的sparse_softmax_cross_entropy_with_logits函数接受的是未归一化的形式
  with tf.variable_scope('softmax_linear') as scope:
    weights = _variable_with_weight_decay('weights', [192, NUM_CLASSES],stddev=1/192.0,wd=0.0)
    biases = _variable_on_cpu('biases', [NUM_CLASSES],tf.constant_initializer(0.0))
    softmax_linear = tf.add(tf.matmul(local4, weights), biases, name=scope.name)
    _activation_summary(softmax_linear)
  return softmax_linear
```

# 训练阶段

## loss

```python
def loss(logits, labels):
# 接受从模型构造函数inference返回的logits，以及从input或者distorted_inputs中的label部分，返回损失tensor
  labels = tf.cast(labels, tf.int64)
  cross_entropy = tf.nn.sparse_softmax_cross_entropy_with_logits(
      labels=labels, logits=logits, name='cross_entropy_per_example')
  cross_entropy_mean = tf.reduce_mean(cross_entropy, name='cross_entropy')
  tf.add_to_collection('losses', cross_entropy_mean)

  # The total loss is defined as the cross entropy loss plus all of the weight
  # decay terms (L2 loss).
  return tf.add_n(tf.get_collection('losses'), name='total_loss')
```

## train

训练阶段就是通过训练算法迭代优化，最小化损失函数的过程。

```python
#接受参数：总损失def train(total_loss, global_step):

  num_batches_per_epoch = NUM_EXAMPLES_PER_EPOCH_FOR_TRAIN / FLAGS.batch_size
  decay_steps = int(num_batches_per_epoch * NUM_EPOCHS_PER_DECAY)

  # 根据当前的训练步数、衰减速度、初始的学习速率确定更新新的学习速率.staircase=True，标明按照梯度下降衰减。即global_step,每隔decay_steps, learing_rate会按照LEARNING_RATE_DECAY_FACTOR（衰减系数）衰减一次。 如果straircase = false, 代表 learning rate 按照连续函数衰减， 即每训练一次，learning rate 都会衰减一次
  lr = tf.train.exponential_decay(INITIAL_LEARNING_RATE,
                                  global_step,
                                  decay_steps,
                                  LEARNING_RATE_DECAY_FACTOR,
                                  staircase=True)
  tf.summary.scalar('learning_rate', lr)

  loss_averages_op = _add_loss_summaries(total_loss)

  # 计算梯度。函数tf.control_dependencies，计算单元梯度计算要在统计之后
  with tf.control_dependencies([loss_averages_op]):
    opt = tf.train.GradientDescentOptimizer(lr)
    grads = opt.compute_gradients(total_loss)

  # 梯度更新参数：计算完了，就反向传播一次，更新被训练的参数
  apply_gradient_op = opt.apply_gradients(grads, global_step=global_step)

  for var in tf.trainable_variables():
    tf.summary.histogram(var.op.name, var)

  for grad, var in grads:
    if grad is not None:
      tf.summary.histogram(var.op.name + '/gradients', grad)


  # 指数移动平均，是指tensorflow会创建一个变量（一般称为shadow variable）来储存某个变量的指数移动平均值，在训练过程中，每训练一次，变量都会学习到一个新的值，则对应的shadow变量也会跟着更新一次（更新需要run update op）。在训练过程中，只会不断更新shadow变量的值，而不会在模型中使用这个shadow变量。这个shadow变量一般是提供给评估过程使用的。 我理解的是，直接使用学习到的变量值进行评估，会导致评估有一定的波动性，如果使用变量的移动平均值替换变量进行评估，则会使评估过程更稳定，而且获得的评估效果也更好。
  variable_averages = tf.train.ExponentialMovingAverage(
      MOVING_AVERAGE_DECAY, global_step)
  variables_averages_op = variable_averages.apply(tf.trainable_variables())

  with tf.control_dependencies([apply_gradient_op, variables_averages_op]):
    train_op = tf.no_op(name='train')

  # 返回训练op
  return train_op
```

# 测试阶段

```python
# 测试一次的函数，saver是操作模型参数文件checkpoints的对象;top_k_op计算准确率def eval_once(saver, summary_writer, top_k_op, summary_op):  
  with tf.Session() as sess:
    ckpt = tf.train.get_checkpoint_state(FLAGS.checkpoint_dir)
    if ckpt and ckpt.model_checkpoint_path:
      # 从checkpoint取出参数
      saver.restore(sess, ckpt.model_checkpoint_path)
      global_step = ckpt.model_checkpoint_path.split('/')[-1].split('-')[-1]
    else:
      print('No checkpoint file found')
      return

    # 开始测试样本队列，多线程
    coord = tf.train.Coordinator()
    try:
      threads = []
      # tensorflow单独创建一个queue runner线程，它负责从文件中读取样本数据，并将其装载到一个队列中。我们只需要开启这个线程，在需要数据时从队列中获取想要的size的数据集就可以了，队列数据的装载由该线程自动实现的。
      for qr in tf.get_collection(tf.GraphKeys.QUEUE_RUNNERS):
        threads.extend(qr.create_threads(sess, coord=coord, daemon=True,
                                         start=True))

      num_iter = int(math.ceil(FLAGS.num_examples / FLAGS.batch_size))
      true_count = 0  # Counts the number of correct predictions.
      total_sample_count = num_iter * FLAGS.batch_size
      step = 0
      while step < num_iter and not coord.should_stop():
        # 计算准确率
        predictions = sess.run([top_k_op])
        true_count += np.sum(predictions)
        step += 1

      # 计算准确率
      precision = true_count / total_sample_count
      print('%s: precision @ 1 = %.3f' % (datetime.now(), precision))

      summary = tf.Summary()
      summary.ParseFromString(sess.run(summary_op))
      summary.value.add(tag='Precision @ 1', simple_value=precision)
      summary_writer.add_summary(summary, global_step)
    except Exception as e:  # pylint: disable=broad-except
      coord.request_stop(e)

    coord.request_stop()
    coord.join(threads, stop_grace_period_secs=10)
```

# 其他

关于tf.train.shuffle_batch 中的参数 shuffle、min_after_dequeue

shuffle的作用在于指定是否需要随机打乱样本的顺序，一般作用于训练阶段，提高鲁棒性。
1. 当shuffle = false时，每次dequeue是从队列中按顺序取数据，遵从先入先出的原则
2. 当shuffle = true时，每次从队列中dequeue取数据时，不再按顺序，而是随机的，所以打乱了样本的原有顺序。

shuffle还要配合参数min_after_dequeue使用才能发挥作用。这个参数min_after_dequeue的意思是队列中，做dequeue（取数据）的操作后，queue runner线程要保证队列中至少剩下min_after_dequeue个数据。如果min_after_dequeue设置的过少，则即使shuffle为true，也达不到好的混合效果。

因为我们的目的肯定是想尽最大可能的混合数据，因此设置min_after_dequeue，可以保证每次dequeue后都有足够量的数据填充尽队列，保证下次dequeue时可以很充分的混合数据。

但是min_after_dequeue也不能设置的太大，这样会导致队列填充的时间变长，尤其是在最初的装载阶段，会花费比较长的时间。

---

## 关于训练与测试

在以前的教程中，都是将训练和评估放在一个程序中运行，而在这个教程中，训练和评估是分开在两个独立的程序中进行的，之所以这样做，是因为评估过程不会直接使用训练学习到的模型参数（trainable variable的值），而是要使用的是变量的滑动平均（shadow variable）来代替原有变量进行评估。

具体的实现方法是，在训练过程中，为每个trainable variable 添加 指数滑动平均变量，然后每训练1000步就将模型训练到的变量值保存在checkpoint中，评估过程运行时，从最新存储的checkpoint中取出模型的shadow variable，赋值给对应的变量，然后进行评估
