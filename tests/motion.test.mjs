import { test } from 'node:test';
import assert from 'node:assert/strict';
import { videoTimeAtProgress, boundedProjectIndex } from '../src/components/portfolio/motionMath.mjs';
test('scrolling forward and backward seeks video proportionally, within media bounds', () => {
 assert.equal(videoTimeAtProgress(.8, 20), 16);
 assert.equal(videoTimeAtProgress(.2, 20), 4);
 assert.equal(videoTimeAtProgress(-.1, 20), 0);
 assert.equal(videoTimeAtProgress(2, 20), 19.96);
 assert.equal(videoTimeAtProgress(.5, NaN), 0);
});
test('showcase arrows cannot navigate beyond the first or last project', () => {
 assert.equal(boundedProjectIndex(0,-1,3),0);
 assert.equal(boundedProjectIndex(0,1,3),1);
 assert.equal(boundedProjectIndex(2,1,3),2);
 assert.equal(boundedProjectIndex(1,1,0),0);
});

test('one wheel detent advances past snap threshold, without skipping several cards', async () => {
 const { galleryWheelDistance } = await import('../src/components/portfolio/motionMath.mjs');
 assert.ok(galleryWheelDistance(100, 0, 10) > 5);
 assert.equal(galleryWheelDistance(700, 0, 10),10);
 assert.equal(galleryWheelDistance(-700, 0, 10),-10);
 assert.equal(galleryWheelDistance(0, 0, 10),0);
 assert.ok(galleryWheelDistance(3, 1, 10) > 5);
});

test('gallery buttons choose nearest cycle rather than rewinding after wrap or long drag', async () => {
 const { nearestGalleryTarget } = await import('../src/components/portfolio/motionMath.mjs');
 assert.equal(nearestGalleryTarget(0,20,10,3),30);
 assert.equal(nearestGalleryTarget(2,0,10,3),-10);
 assert.equal(nearestGalleryTarget(1,90,10,3),100);
 assert.equal(nearestGalleryTarget(0,-20,10,3),-30);
});

test('vertical swipes and return-to-origin drags remain gestures, not card clicks', async () => {
 const { galleryDragDistance } = await import('../src/components/portfolio/motionMath.mjs');
 assert.ok(galleryDragDistance(0,0,0,80,0) >= 15);
 assert.equal(galleryDragDistance(0,0,0,0,80),80);
});

test('portrait scenes follow section positions and reverse without getting stuck', async () => {
 const { sceneStateAtScroll } = await import('../src/components/portfolio/motionMath.mjs');
 const tops=[0,1200,2400,3600,4800];
 assert.deepEqual(sceneStateAtScroll(0,tops,1000),{from:0,to:0,blend:0});
 assert.deepEqual(sceneStateAtScroll(650,tops,1000),{from:0,to:1,blend:.5});
 assert.deepEqual(sceneStateAtScroll(1000,tops,1000),{from:1,to:1,blend:0});
 assert.deepEqual(sceneStateAtScroll(5500,tops,1000),{from:4,to:4,blend:0});
 assert.deepEqual(sceneStateAtScroll(650,tops,1000),{from:0,to:1,blend:.5});
});

test('layer transitions conserve visibility and move both poses in the same direction', async () => {
 const { layerPose } = await import('../src/components/portfolio/motionMath.mjs');
 for (const progress of [0,.1,.5,.9,1,1.5,3.5,4]) {
   const poses=Array.from({length:5},(_,index)=>layerPose(progress,index));
   assert.ok(Math.abs(poses.reduce((sum,p)=>sum+p.opacity,0)-1)<.00001);
   assert.ok(poses.every(p=>p.scale>0 && p.scale<=1.04));
 }
 assert.equal(layerPose(0,0).opacity,1);
 assert.equal(layerPose(4,4).opacity,1);
 assert.equal(layerPose(.5,0).x,-3.5);
 assert.equal(layerPose(.5,1).x,3.5);
 assert.ok(layerPose(.75,0).x<layerPose(.25,0).x);
 assert.ok(layerPose(.75,1).x<layerPose(.25,1).x);
 assert.equal(layerPose(0,4).opacity,0);
 assert.equal(layerPose(2.5,2).opacity,.5);
 assert.equal(layerPose(2.5,3).opacity,.5);
});
