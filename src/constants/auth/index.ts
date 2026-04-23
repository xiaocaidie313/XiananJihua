/** 登录类型 */
export const LoginType = {
  email_code: 'email_code',
  password: 'password',
} as const

export type LoginType = (typeof LoginType)[keyof typeof LoginType]

/** 角色类型 */
export const RoleType = {
  superadmin: 'superadmin',
  class_admin: 'classadmin',
  student: 'student',
  staff: 'staff',
} as const

export type RoleType = (typeof RoleType)[keyof typeof RoleType]

/** 班级信息 */
export interface ClassInfo {
  class_id: number
  class_name: string
  class_description: string
  admin_id: number
  student_count: number
  status: number
  created_at: number
  updated_at: number
}

/** 邀请码信息 */
export interface InviteCodeInfo {
  code: string
  creator_id: number
  department: string
  max_uses: number
  used_count: number
  remark: string
  expires_at: number
  target_role: RoleType
  class_id: number
  created_at: number
  updated_at: number
}

/** 用户信息 */
export interface UserInfo {
  user_id: number
  name: string
  email: string
  avatar: string
  phone: string
  department: string
  role: RoleType
  class_id: number
  status: number
  invite_code_used: string
  created_at: number
  updated_at: number
}

/** 注册成功类型 */
export interface RegisterSuccess {
  user: UserInfo
}

/** 登录成功类型 */
export interface LoginSuccess {
  token: string
  user: UserInfo
}

/** 邀请码生成成功类型 */
export interface GenerateInviteCodeSuccess {
  invite_code: InviteCodeInfo
}

/** 获取邀请码成功类型 */
export interface GetInviteCodeSuccess {
  invite_codes: InviteCodeInfo[]
  has_more: boolean
  next_cursor: number
}

/** 获取班级列表成功类型 */
export interface GetClassListSuccess {
  classes: ClassInfo[]
  has_more: boolean
  next_cursor: number
}

/** 后端返回的userinfo */
export interface ResUserInfo {
  user_info:UserInfo
}