export interface IAdmin {
	_id: string
	fullName: string
	email: string
	mobileNumber: string
	role: string
	password?: string
	encryptedPassword?: string
	notes?: string
	status: 'active' | 'inactive' | 'suspended' | 'removed'
	createdAt: string
	updatedAt: string
}

export interface AdminCreatePayload {
	fullName: string
	email: string
	mobileNumber: string
	role: string
	password: string
	notes?: string
}

export interface AdminLoginPayload {
	email: string
	password: string
}

export interface AdminResponse {
	token: string
	admin: IAdmin
}

export interface AdminUpdatePayload {
	fullName?: string
	email?: string
	mobileNumber?: string
	role?: string
	notes?: string
	status?: 'active' | 'inactive' | 'suspended' | 'removed'
}

export interface Role {
	_id: string;
	name: string;
	permissions: string[];
	description: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
  }
  
  export interface AdminUser {
	_id: string;
	fullName: string;
	email: string;
	mobileNumber: string;
	role: Role;
	password: string;
	encryptedPassword: string;
	notes: string;
	status: "active" | "inactive"; // add other statuses if possible
	createdAt: string;
	updatedAt: string;
	__v: number;
	assignedWarehouses: string[] | null;
	id: string;
  }

export interface UpdateAdminPayload {
	id: string;
	fullName?: string;
	email?: string;
	mobileNumber?: string;
	role?: string;
	password?: string;
	notes?: string;
  }
  
