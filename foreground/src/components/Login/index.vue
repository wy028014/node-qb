<template>
  <div class="loginComponents bg-white scale-150 rounded-lg flex flex-col h-100 p-10 w-130">
    <div class="text-5xl font-bold pb-5 text-center">登录</div>
    <div class="body h-full">
      <el-form label-position="left" label-width="100" label-suffix=":" ref="formRef" status-icon
        :hide-required-asterisk="false" :model="data" :rules="rules">
        <el-form-item label="登陆账号" prop="l_username">
          <el-input clearable placeholder="请输入登录账号" required v-model="data.l_username" />
        </el-form-item>
        <el-form-item label="登录密码" prop="l_password">
          <el-input clearable placeholder="请输入登录密码" show-password type="password" v-model="data.l_password" />
        </el-form-item>
        <el-form-item label="验证码" prop="l_captcha">
          <el-col :span="16">
            <el-input clearable placeholder="请输入验证码" v-model="data.l_captcha" />
          </el-col>
          <el-col :span="8">
            <el-image class="!block w-full h-8" :src="captchaSrc" alt="" @click="btn_captcha">
              <template #error>
                <div class="text-gray-500 text-center" @click="btn_captcha">
                  <span>点击重试</span>
                </div>
              </template>
            </el-image>
          </el-col>
        </el-form-item>
      </el-form>
      <el-button auto-insert-space class="w-full bg-gradient-to-l from-blue-500 to-green-500" type="primary"
        @click="handleLogin">登陆</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FormInstance } from 'element-plus"
import loginData from './data"
import { useRouter } from 'vue-router"
import { ref } from 'vue"

const router = useRouter()
const { captchaSrc, data, rules, btn_captcha, btn_login } = loginData()

const formRef = ref<FormInstance>()

const handleLogin = () => {
  btn_login(formRef.value, router)
}
</script>

<style scoped>
.loginComponents {
  scale: 1.3;
}
</style>