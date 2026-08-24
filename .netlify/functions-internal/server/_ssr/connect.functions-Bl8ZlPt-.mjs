import { c as createSsrRpc } from "./router-CcOqsHDG.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-pF3e_tkz.mjs";
import { c as createServerFn } from "./server-DWRkkZvt.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
const createConnectAccount = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("85b7a3174a7c86ada231dfad8b07c7d29473fdd542762a1ff77cf462ff998f4e"));
const createOnboardingLink = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("f7b87ff48da9e21892a6b685a794e2c6e6f21cf6f7e32912ee9ce0f4769af37b"));
const refreshAccountStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("82bd273ab0a0d3c84f260e47dbb167e8f59003492349ddb51f392b9f1da82248"));
const createDashboardLink = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("b58094d7b8ec6f8db051111ee0bf59fbf0e777e711c59501395a6a0d268ccef3"));
const payoutInput = objectType({
  orderId: stringType().uuid()
});
const payoutDriverForOrder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => payoutInput.parse(d)).handler(createSsrRpc("570058cf6b0042e8fa6a4e0d848e7d53166e4183449f5f325065fa98e3ee485c"));
export {
  createOnboardingLink as a,
  createDashboardLink as b,
  createConnectAccount as c,
  payoutDriverForOrder as p,
  refreshAccountStatus as r
};
