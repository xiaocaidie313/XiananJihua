import type { UserInfo } from '@/constants/auth'
import { RoleType } from '@/constants/auth'

/** 可进入内容上传页的角色：超级管理员、教职工（staff） */
export function canAccessUpload(user: UserInfo | null | undefined): boolean {
  const role = user?.role
  return role === RoleType.superadmin || role === RoleType.staff
}
