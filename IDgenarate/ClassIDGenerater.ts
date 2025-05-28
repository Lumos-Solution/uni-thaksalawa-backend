import { Class } from '../schema/ClassSchema';

export async function generateClassID(): Promise<string> {
    const lastClass = await Class.findOne({})
        .sort({ createdAt: -1 }) // get most recent class
        .select('classId');

    if (!lastClass) {
        return 'C001';
    }

    const lastIdNumber = parseInt(lastClass.classId.replace('C', ''), 10);
    const newIdNumber = lastIdNumber + 1;

    const newCustomId = `C${String(newIdNumber).padStart(3, '0')}`;
    return newCustomId;
}
