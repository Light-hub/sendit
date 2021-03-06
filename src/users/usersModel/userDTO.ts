import { IsEmail, IsNotEmpty, IsNumberString, Length, MinLength } from "class-validator";

export class userRegistrationDTO{
    @IsNotEmpty()
    name : string;

    @IsNotEmpty()
    firstName : string;

    @IsNotEmpty()
    @MinLength(10)
    password : string;

    @IsNumberString()
    @Length(10,14)
    phone : string;
    
    @IsEmail()
    email : string;
}

export class userLoginDTO{
    @IsNotEmpty()
    @MinLength(10)
    password : string;

    @IsEmail()
    email : string;
}