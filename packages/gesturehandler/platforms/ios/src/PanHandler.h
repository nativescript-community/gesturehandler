//
//  PanHandler.h
//  GestureHandler
//
//  Created by Krzysztof Magiera on 12/10/2017.
//  Copyright © 2017 Software Mansion. All rights reserved.
//

#import "GestureHandler.h"

@interface PanGestureHandler : GestureHandler

//@property (nonatomic) CGFloat minDist;
//@property (nonatomic) CGFloat minVelocityX;
//@property (nonatomic) CGFloat minVelocityY;
//@property (nonatomic) CGFloat activeOffsetXStart;
//@property (nonatomic) CGFloat activeOffsetXEnd;
//@property (nonatomic) CGFloat failOffsetXStart;
//@property (nonatomic) CGFloat failOffsetXEnd;
//@property (nonatomic) CGFloat activeOffsetYStart;
//@property (nonatomic) CGFloat activeOffsetYEnd;
//@property (nonatomic) CGFloat failOffsetYStart;
//@property (nonatomic) CGFloat failOffsetYEnd;

- (void)setMinDist:(CGFloat)value;
- (void)setMinVelocityX:(CGFloat)value;
- (void)setMinVelocityY:(CGFloat)value;
- (void)setMinVelocitySq:(CGFloat)value;
- (void)setActiveOffsetXStart:(CGFloat)value;
- (void)setActiveOffsetXEnd:(CGFloat)value;
- (void)setFailOffsetXStart:(CGFloat)value;
- (void)setFailOffsetXEnd:(CGFloat)value;
- (void)setActiveOffsetYStart:(CGFloat)value;
- (void)setActiveOffsetYEnd:(CGFloat)value;
- (void)setFailOffsetYStart:(CGFloat)value;
- (void)setFailOffsetYEnd:(CGFloat)value;

@end
