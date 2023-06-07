const Razorpay = require("razorpay")

const instance = new Razorpay({
    key_id:"rzp_test_UqgHf2WJ8UtlZ8",key_secret:"p7LDhmaJmdWG43XvePBgcnCH"
})

const checkOut = async(req,resp)=>{
      const {amount} = req.body;
    try {
        const option={
            amount:amount*100,
            currency:"USD"
        }

        const order = await instance.orders.create(option)
        resp.send(order)

    } catch (error) {
        resp.send(error.message)
    }
}

const paymentVerification = async (req, resp) => {
    try {
      const { razorpayOrderId, razorpayPaymentId } = req.body;
  
      resp.send({
        razorpayOrderId,
        razorpayPaymentId,
      });
    } catch (error) {
      console.error(error);
      resp.status(500).send("Some error occurred");
    }
  };
  

module.exports={
    checkOut,
    paymentVerification
}