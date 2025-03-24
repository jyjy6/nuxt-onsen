import mongoose, { Schema, Document, Model } from "mongoose";

// ✅ User 인터페이스 정의
interface IUser extends Document {
  username: string;
  name: string;
  email: string;
  password: string;
  profileImage?: string;
  phone?: string;
  address?: {
    country?: string;
    mainAddress?: string;
    subAddress?: string;
  };
  status: "active" | "suspended" | "withdrawal";
  role: "user" | "admin" | "premium";
  lastLogin?: Date;
  loginAttempts?: number;
  resetPasswordToken?: string;
  loginSuspendedTime?: Date;
  premiumUntil?: Date;
}

// ✅ 스태틱 메서드를 포함하는 Model 타입 확장
interface IUserModel extends Model<IUser> {
  findByName(name: string): Promise<IUser | null>;
}

const registerSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    phone: { type: String },
    address: {
      country: String,
      mainAddress: String,
      subAddress: String,
    },
    status: {
      type: String,
      enum: ["active", "suspended", "withdrawal"],
      default: "active",
    },
    role: { type: String, enum: ["user", "admin", "premium"], default: "user" },
    lastLogin: { type: Date },
    loginAttempts: { type: Number, default: 0 },
    resetPasswordToken: { type: String },
    loginSuspendedTime: { type: Date },
    premiumUntil: { type: Date },
  },
  { timestamps: true }
);

// ✅ findByName 메서드 추가 (스태틱)
registerSchema.statics.findByName = function (name: string) {
  return this.findOne({ name });
};

// ✅ 확장된 IUserModel을 사용하여 모델 생성
const RegisterModel = mongoose.model<IUser, IUserModel>(
  "Register",
  registerSchema
);

export default RegisterModel;
