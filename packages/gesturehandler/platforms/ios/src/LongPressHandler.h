//
//  LongPressHandler.h
//  GestureHandler
//
//  Created by Krzysztof Magiera on 12/10/2017.
//  Copyright © 2017 Software Mansion. All rights reserved.
//

#import "GestureHandler.h"

@interface LongPressGestureHandler : GestureHandler

- (void) setMinDurationMs:(CGFloat) value;
- (void) setMaxDist:(CGFloat) value;
@end
