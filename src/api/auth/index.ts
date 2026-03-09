import type {
  GenerateInviteCodeSuccess,
  GetClassListSuccess,
  GetInviteCodeSuccess,
  LoginSuccess,
  RegisterSuccess,
  UserInfo,
} from '../../constants/auth'
import instance, { type CommonResponse } from '../../utils/http'
import type {
  EmailParams,
  GenerateClassParams,
  GenerateInviteCodeParams,
  GetClassInfoParams,
  GetClassListParams,
  GetInviteCodeParams,
  GetUserInfoParams,
  LoginParams,
  RegisterParams,
} from './types'

/**
 * 发送邮箱验证码
 */
export const sendEmailCode = (params: EmailParams) => {
  return instance.post<CommonResponse<Record<string, never>>>('/api/sendEmailCode', params)
}

/** 注册 */
export const register = (params: RegisterParams) => {
  return instance.post<CommonResponse<RegisterSuccess>>('/api/auth/register', params)
}

/** 登录 */
export const login = (params: LoginParams) => {
  return instance.post<CommonResponse<LoginSuccess>>('/api/auth/login', params)
}

/** 生成邀请码 */
export const generateInviteCode = (params: GenerateInviteCodeParams) => {
  return instance.post<CommonResponse<GenerateInviteCodeSuccess>>('/api/auth/generate-invite-code', params)
}

/** 获取邀请码 */
export const getInviteCode = (params: GetInviteCodeParams) => {
  return instance.get<CommonResponse<GetInviteCodeSuccess>>('/api/auth/get-invite-code', params)
}

/** 获取用户信息 */
export const getUserInfo = (params: GetUserInfoParams) => {
  return instance.get<CommonResponse<UserInfo>>('/api/auth/get-user-info', params)
}

/** 修改用户信息 */
export const updateUserInfo = (params: Record<string, unknown>) => {
  return instance.post<CommonResponse<UserInfo>>('/api/auth/modify-user-base-info', params)
}

/** 生成班级 */
export const generateClass = (params: GenerateClassParams) => {
  return instance.post<CommonResponse<Record<string, never>>>('/api/auth/generate-class', params)
}

/** 获取班级列表 */
export const getClassList = (params: GetClassListParams) => {
  return instance.get<CommonResponse<GetClassListSuccess>>('/api/auth/get-class-list', params)
}

/** 获取班级信息 */
export const getClassInfo = (params: GetClassInfoParams) => {
  return instance.get<CommonResponse<Record<string, unknown>>>('/api/auth/get-class-info', params)
}

/** 切换班级 */
export const switchClass = (invite_code: string) => {
  return instance.post<CommonResponse<Record<string, never>>>('/api/auth/switch-class', { invite_code })
}
