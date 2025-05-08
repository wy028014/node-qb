import NProgress from "nprogress"
import "nprogress/nprogress.css"

NProgress.configure({
  easing: `ease`,
  speed: 500,
  showSpinner: false,
  trickle: true,
  trickleSpeed: 200,
  minimum: 0.3,
})

export const Nprogress = NProgress
