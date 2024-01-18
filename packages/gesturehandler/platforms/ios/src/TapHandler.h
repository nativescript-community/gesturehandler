//
//  TapHandler.h
//  GestureHandler
//
//  Created by Krzysztof Magiera on 12/10/2017.
//  Copyright © 2017 Software Mansion. All rights reserved.
//

#import "GestureHandler.h"

@interface TapGestureHandler : GestureHandler
-(void)resetStored;
- (void)setMaxDist:(CGFloat)value;
- (void)setNumberOfTaps:(NSUInteger)value;
- (void)setMaxDelayMs:(CGFloat)value;
- (void)setMaxDurationMs:(CGFloat)value;
- (void)setMaxDeltaX:(CGFloat)value;
- (void)setMaxDeltaY:(CGFloat)value;
- (void)setMinPointers:(NSInteger)value;
@end
