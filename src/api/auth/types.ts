import { LoginType, RoleType } from '../../constants/auth'

/** 邮箱验证参数 */
export interface EmailParams {
  email: string
}

/** 注册参数 */
export interface RegisterParams {
  email: string
  email_code: string
  invite_code_used: string
  password: string
}

/** 登录参数 */
export interface LoginParams {
  email: string
  password: string
  type: LoginType
}

/** 生成邀请码参数 */
export interface GenerateInviteCodeParams {
  class_id: number
  department: string
  expires_at: number
  max_uses: number
  remark: string
  target_role: RoleType
}

/** 获取邀请码参数 */
export interface GetInviteCodeParams {
  page_size: number
  cursor: number
  user_id: number
}

/** 获取用户信息参数 */
export interface GetUserInfoParams {
  user_id: number
}

/** 生成班级参数 */
export interface GenerateClassParams {
  class_name: string
  class_description: string
}

/** 获取班级列表参数 */
export interface GetClassListParams {
  page_size: number
  cursor: number
  user_id: number
}

/** 获取班级信息参数 */
export interface GetClassInfoParams {
  class_id: number
}
