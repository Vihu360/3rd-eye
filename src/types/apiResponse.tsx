export interface ApiResponse {
	success: boolean,
	fullName?: string,
	message: string
}

// jwt interface

export interface JwtPayload {
	_id: string;
	[key: string]: string;  // can have addidtional properties
}
