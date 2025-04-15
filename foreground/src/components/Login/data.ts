import { FormInstance } from 'element-plus';
import { reactive, ref } from 'vue';
import { useInfoStore, useMenuStore } from '@/store';
import { useRouter } from 'vue-router';

const loginData = () => {
  const captchaSrc = ref<string>(`/api/base`);
  const data = reactive({
    l_username: `028014`,
    l_password: `123456`,
    l_captcha: ``,
  });
  const rules = {
    l_username: [
      { message: `必须要填入登录账号!`, required: true, trigger: `blur` },
    ],
    l_password: [
      { message: `必须要填入登录密码!`, required: true, trigger: `blur` },
    ],
    l_captcha: [
      { message: `必须要填入验证码!`, required: true, trigger: `blur` },
      { message: `验证码有且只有4位!`, min: 4, max: 4, trigger: `blur` },
    ],
  };

  const btn_captcha = () => {
    const url = new URL(captchaSrc.value, window.location.origin);
    url.searchParams.set('_t', Math.random().toString());
    captchaSrc.value = url.href;
  };

  const btn_login = async (
    formEl: FormInstance | undefined,
    router: ReturnType<typeof useRouter>,
  ) => {
    if (!formEl) return;
    formEl.validate(async (valid) => {
      if (valid) {
        const infoStore = useInfoStore();
        const menuStore = useMenuStore();
        try {
          await infoStore.login(data);
          await menuStore.setPermission({
            exclude: [`createdAt`, `updatedAt`, `deletedAt`],
            userId: infoStore.userId,
          });
          menuStore.setMenus();
          router.push({ path: `/management/train` });
        } catch (error) {
          data.l_captcha = ``;
          btn_captcha();
        }
      }
    });
  };

  return {
    captchaSrc,
    data,
    rules,
    btn_captcha,
    btn_login,
  };
};

export default loginData;
