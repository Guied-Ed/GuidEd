import mongoose, { Schema, Document, model } from 'mongoose';
import validator from 'validator';
type Rating = {
    userId: mongoose.Types.ObjectId;
    rating: number;
    comment?: string;
};

type Video = {
    tittle: string;
    videoFilePath: string;
    duration?: number;
    description?: string;
};

interface CourseModel extends Document {
    tittle: string;
    description: string;
    instructor: mongoose.Types.ObjectId;
    duration: number;
    category: string;
    price: number;
    level: string;
    thumbnail: string;
    videos: Video[];
    ratings: Rating[];
}

const courseSchema = new Schema<CourseModel>(
    {
        tittle: {
            type: String,
            required: [true, 'Course Tittle is required'],
        },
        description: {
            type: String,
            required: [true, 'Course Description is required'],
            trim: true,
        },
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Course Instructor is required'],
        },
        duration: {
            type: Number,
            required: [true, 'Course duration is required'],
            min: [1, 'Course duration must be more than one minute'],
        },
        category: {
            type: String,
            required: [true, 'Course category is required'],
        },
        price: {
            type: Number,
            required: [true, 'Course price is required'],
            min: [0, 'Course price cannot be negative'],
        },
        level: {
            type: String,
            required: [true, 'Course level is required'],
            enum: ['Begginer', 'Intermediate', 'Advanced'],
        },
        thumbnail: {
            type: String,
            required: [true, 'Course thumbnail is required'],
            validate: {
                validator: function (v: string) {
                    return /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/.test(v);
                },
                message: (props: any) => `${props.value} is a valid url`,
            },
        },
        videos: [
            {
                tittle: {
                    type: String,
                    required: [true, 'Course video tittle is required'],
                },
                videoFilePath: {
                    type: String,
                    required: [true, 'Course video file path is required'],
                    validate: {
                        validator: function (v: string) {
                            return /^https?:\/\/.+\.(mp4|mkv|avi|mov|flv)$/.test(
                                v,
                            );
                        },
                        message: (props: any) =>
                            `${props.value} is not a valid video URL!`,
                    },
                },
                duration: {
                    type: Number,
                    required: [true, 'Video duration is required'],
                    min: [1, 'Video duration must be greater than 1 minute'],
                },
            },
        ],
        ratings: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: [true, 'User id is required'],
                },
                rating: {
                    type: Number,
                    required: [true, 'Rating is required'],
                    min: [1, 'Rating must be greater than 1'],
                    max: [5, 'Rating cannot be more than Five'],
                },
                comment: {
                    type: String,
                    trim: true,
                },
            },
        ],
    },
    { timestamps: true },
);

const Course = model<CourseModel>('Course', courseSchema);

export default Course;
