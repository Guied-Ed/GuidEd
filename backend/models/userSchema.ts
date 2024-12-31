
import mongoose, {Document, Schema,model} from 'mongoose';
import validator from 'validator'

enum userRole{
    ADMIN='admin',
    STUDENT='student',
    INSTRUCTOR='instructor'
}

interface Course {
    courseId:mongoose.Types.ObjectId,
    enrolledDate:Date,
    progress:number
}

interface UserModel extends Document{
    _id: mongoose.Types.ObjectId,
    firstName:string,
    lastName:string,
    email:string,
    password:string,
    confirmPassword:string | undefined,
    role:userRole,
    lastLogin:Date,
    isVerified:boolean,
    courses:Course [],
    resetPasswordToken:string | undefined,
    resetPasswordExpiresDate:Date | undefined,
    verificationToken:string | undefined,
    verificationTokenExpiresDate:string | undefined,
}






const userSchema = new Schema<UserModel>({
    firstName:{
        type:String,
        required:[true, "UserName is required"]
    },
    lastName:{
        type:String, 
        required:[true, 'LastName is required']
    },
    email:{
        type:String,
        required:[true, 'Email is required'],
        validate:{
            validator:function(v:string){
                return validator.isEmail(v);
            },
            message:(props:any)=> `${props.value} is not a valid Email Address`
        },
        unique:true
    },
    password:{
        type:String,
        required:[true, 'Password is required'],
        minlength:[8, 'Password must be at least 8 characters']
    },
    lastLogin:{
        type:Date,
        default:Date.now()
    },
    confirmPassword:{
        type:String,
        // required:[true,'Confirm Password is required'],
        validate:{
            validator:function(v:string):boolean{
                return v === this.password;
            },
         message:()=> `Passwords do not match`
        }
    },
    role:{
        type:String,
        enum:Object.values(userRole),
        default:userRole.STUDENT
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    courses:[
        {
        courseId:{
            type:mongoose.Types.ObjectId
        },
        enrolledDate:{
            type:Date, 
            default:Date.now()
        }

    }
    ],
    resetPasswordToken:String,
    resetPasswordExpiresDate:Date,
    verificationToken:String,
    verificationTokenExpiresDate:Date
})


userSchema.pre('save', function (next) {
  
    // Remove confirmPassword before saving the document
    this.confirmPassword = undefined;
    next();
});

const User = model<UserModel>('User', userSchema);

export default User;

