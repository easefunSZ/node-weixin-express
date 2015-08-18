var pay = require('../lib/pay');

module.exports = {
  '/weixin/pay/init': function(app, merchant, certificate, urls, restApi) {
    return function(req, res) {
      var data = {};
      data.openid = req.session.weixin.openid;
      var ip = req.headers['x-forwarded-for']
        || (req.connection ? req.connection.remoteAddress : null)
        || req.ip;
      var ips = ip.split(',');
      ip = ips[0];
      data.spbill_create_ip = ip;
      data.notify_url = urls.callback;

      var desc = req.param('desc');
      var no = req.param('no');
      var type = req.param('type');
      var fee = req.param('fee');

      data.body = desc;
      data.out_trade_no = no;
      data.total_fee = fee;
      data.trade_type = type || 'JSAPI';

      // mostly useless
      //data.sub_mch_id = 'xxx'
      //data.device_info = 'xxx'
      //data.attach = 'xxx'
      //data.time_start = 'xxx'
      //data.time_expire = 'xxx'
      //data.goods_tag = 'xxx'
      //data.product_id = 'xxx'
      //data.attach = 'xxx'
      console.log(data);
      console.log('pay');
      pay.api.order.unified(data, function (error, data) {
        console.log(error);
        console.log(data);
        if (error.code) {
          api(errors.ERROR, res, error);
          return;
        }
        var prepayId = data.prepay_id;
        var prepayData = weixin.api.jssdk.prepay(data.prepay_id);
        console.log(prepayData);
        api(errors.SUCCESS, res, prepayData);
      });
    };
  },
  '/weixin/pay/main': function(app, merchant, certificate, urls, restApi) {

    return function(req, res) {

    }

  }
};